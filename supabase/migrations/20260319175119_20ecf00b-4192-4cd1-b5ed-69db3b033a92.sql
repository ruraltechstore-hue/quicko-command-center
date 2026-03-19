
ALTER FUNCTION current_driver_id() SET search_path = public;
ALTER FUNCTION current_rider_id() SET search_path = public;
ALTER FUNCTION is_admin() SET search_path = public;
ALTER FUNCTION create_driver_wallet() SET search_path = public;
ALTER FUNCTION credit_driver_wallet(UUID, UUID, NUMERIC) SET search_path = public;
ALTER FUNCTION nearby_drivers(DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, vehicle_type) SET search_path = public;
