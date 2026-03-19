
-- Helper functions
CREATE OR REPLACE FUNCTION current_driver_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT id FROM drivers WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION current_rider_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT id FROM riders WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
    SELECT COALESCE(
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
        false
    );
$$;

-- RLS on all tables
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- riders policies
CREATE POLICY riders_select ON riders FOR SELECT USING (auth_id = auth.uid() OR is_admin());
CREATE POLICY riders_insert ON riders FOR INSERT WITH CHECK (auth_id = auth.uid());
CREATE POLICY riders_update ON riders FOR UPDATE USING (auth_id = auth.uid()) WITH CHECK (auth_id = auth.uid());

-- drivers policies
CREATE POLICY drivers_select ON drivers FOR SELECT USING (auth_id = auth.uid() OR is_admin());
CREATE POLICY drivers_insert ON drivers FOR INSERT WITH CHECK (auth_id = auth.uid());
CREATE POLICY drivers_update ON drivers FOR UPDATE USING (auth_id = auth.uid()) WITH CHECK (auth_id = auth.uid());

-- vehicles policies
CREATE POLICY vehicles_select ON vehicles FOR SELECT USING (driver_id = current_driver_id() OR is_admin());
CREATE POLICY vehicles_insert ON vehicles FOR INSERT WITH CHECK (driver_id = current_driver_id());
CREATE POLICY vehicles_update ON vehicles FOR UPDATE USING (driver_id = current_driver_id());

-- driver_documents policies
CREATE POLICY docs_select ON driver_documents FOR SELECT USING (driver_id = current_driver_id() OR is_admin());
CREATE POLICY docs_insert ON driver_documents FOR INSERT WITH CHECK (driver_id = current_driver_id());
CREATE POLICY docs_update ON driver_documents FOR UPDATE USING (driver_id = current_driver_id());

-- driver_locations policies
CREATE POLICY loc_driver_all ON driver_locations FOR ALL USING (driver_id = current_driver_id()) WITH CHECK (driver_id = current_driver_id());
CREATE POLICY loc_admin_read ON driver_locations FOR SELECT USING (is_admin());

-- ride_requests policies
CREATE POLICY req_rider_select ON ride_requests FOR SELECT USING (rider_id = current_rider_id() OR is_admin());
CREATE POLICY req_rider_insert ON ride_requests FOR INSERT WITH CHECK (rider_id = current_rider_id());
CREATE POLICY req_rider_update ON ride_requests FOR UPDATE USING (rider_id = current_rider_id());
CREATE POLICY req_driver_select ON ride_requests FOR SELECT USING (
    status = 'searching' AND EXISTS (
        SELECT 1 FROM drivers d
        WHERE d.id = current_driver_id()
        AND d.status = 'approved'
        AND d.duty_status = 'on_duty'
        AND d.vehicle_type = ride_requests.vehicle_type
    )
);

-- trips policies
CREATE POLICY trips_rider_select ON trips FOR SELECT USING (rider_id = current_rider_id() OR is_admin());
CREATE POLICY trips_driver_select ON trips FOR SELECT USING (driver_id = current_driver_id());
CREATE POLICY trips_driver_update ON trips FOR UPDATE USING (driver_id = current_driver_id());
CREATE POLICY trips_rider_update ON trips FOR UPDATE USING (rider_id = current_rider_id());

-- driver_earnings policies
CREATE POLICY earnings_select ON driver_earnings FOR SELECT USING (driver_id = current_driver_id() OR is_admin());

-- driver_wallets policies
CREATE POLICY wallet_select ON driver_wallets FOR SELECT USING (driver_id = current_driver_id() OR is_admin());

-- wallet_transactions policies
CREATE POLICY wallet_txn_select ON wallet_transactions FOR SELECT USING (driver_id = current_driver_id() OR is_admin());

-- Trigger: auto-create wallet for new driver
CREATE OR REPLACE FUNCTION create_driver_wallet()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO driver_wallets (driver_id, balance, total_earned, total_paid)
    VALUES (NEW.id, 0.00, 0.00, 0.00)
    ON CONFLICT (driver_id) DO NOTHING;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_create_driver_wallet
    AFTER INSERT ON drivers
    FOR EACH ROW
    EXECUTE FUNCTION create_driver_wallet();

-- Wallet credit function
CREATE OR REPLACE FUNCTION credit_driver_wallet(
    p_driver_id UUID, p_trip_id UUID, p_amount NUMERIC
) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE v_new_balance NUMERIC;
BEGIN
    UPDATE driver_wallets SET balance = balance + p_amount, total_earned = total_earned + p_amount, updated_at = NOW()
    WHERE driver_id = p_driver_id RETURNING balance INTO v_new_balance;
    INSERT INTO wallet_transactions (driver_id, trip_id, type, category, amount, balance_after, description)
    VALUES (p_driver_id, p_trip_id, 'credit', 'trip_earning', p_amount, v_new_balance, 'Trip earning credited');
END;
$$;

-- Nearby drivers function
CREATE OR REPLACE FUNCTION nearby_drivers(
    lat DOUBLE PRECISION, lng DOUBLE PRECISION, radius_km DOUBLE PRECISION DEFAULT 5, v_type vehicle_type DEFAULT 'cab'
) RETURNS TABLE (driver_id UUID, distance_km DOUBLE PRECISION) LANGUAGE sql STABLE AS $$
    SELECT driver_id, distance_km FROM (
        SELECT dl.driver_id, (6371 * acos(LEAST(1,
            cos(radians(lat)) * cos(radians(dl.latitude)) * cos(radians(dl.longitude) - radians(lng))
            + sin(radians(lat)) * sin(radians(dl.latitude))
        ))) AS distance_km
        FROM driver_locations dl JOIN drivers d ON d.id = dl.driver_id
        WHERE d.status = 'approved' AND d.duty_status = 'on_duty' AND d.vehicle_type = v_type
        AND dl.updated_at > NOW() - INTERVAL '2 minutes'
    ) sub WHERE distance_km <= radius_km ORDER BY distance_km ASC LIMIT 20;
$$;
