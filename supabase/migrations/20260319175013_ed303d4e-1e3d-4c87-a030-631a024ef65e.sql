
CREATE TYPE user_role       AS ENUM ('rider', 'driver');
CREATE TYPE driver_status   AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE duty_status     AS ENUM ('on_duty', 'off_duty');
CREATE TYPE vehicle_type    AS ENUM ('bike', 'auto', 'cab');
CREATE TYPE ownership_type  AS ENUM ('self', 'rented');
CREATE TYPE document_type   AS ENUM ('dl_front', 'dl_back', 'rc_front', 'rc_back', 'aadhaar_front', 'aadhaar_back', 'pan');
CREATE TYPE doc_status      AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE trip_status     AS ENUM ('requested', 'accepted', 'arrived', 'ongoing', 'completed', 'cancelled');
CREATE TYPE txn_type        AS ENUM ('credit', 'debit');
CREATE TYPE txn_category    AS ENUM ('trip_earning', 'commission', 'withdrawal', 'bonus', 'refund');

CREATE TABLE riders (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id     UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    phone       TEXT        NOT NULL UNIQUE,
    name        TEXT,
    email       TEXT,
    avatar_url  TEXT,
    fcm_token   TEXT,
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_riders_auth_id ON riders(auth_id);
CREATE INDEX idx_riders_phone   ON riders(phone);

CREATE TABLE drivers (
    id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id         UUID          NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    phone           TEXT          NOT NULL UNIQUE,
    name            TEXT          NOT NULL,
    date_of_birth   DATE,
    gender          TEXT          CHECK (gender IN ('male', 'female', 'other')),
    city            TEXT          NOT NULL,
    vehicle_type    vehicle_type  NOT NULL,
    status          driver_status NOT NULL DEFAULT 'pending',
    duty_status     duty_status   NOT NULL DEFAULT 'off_duty',
    avatar_url      TEXT,
    fcm_token       TEXT,
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    rejection_note  TEXT,
    approved_at     TIMESTAMPTZ,
    upi_id          TEXT,
    accepted_terms  BOOLEAN       NOT NULL DEFAULT FALSE,
    whatsapp_opt_in BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_drivers_auth_id    ON drivers(auth_id);
CREATE INDEX idx_drivers_phone      ON drivers(phone);
CREATE INDEX idx_drivers_city       ON drivers(city);
CREATE INDEX idx_drivers_status     ON drivers(status);
CREATE INDEX idx_drivers_duty       ON drivers(duty_status);
CREATE INDEX idx_drivers_city_duty  ON drivers(city, status, duty_status);

CREATE TABLE vehicles (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id       UUID           NOT NULL UNIQUE REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_number  TEXT           NOT NULL UNIQUE,
    vehicle_type    vehicle_type   NOT NULL,
    make            TEXT,
    model           TEXT,
    year            INT            CHECK (year BETWEEN 2000 AND 2100),
    color           TEXT,
    ownership_type  ownership_type NOT NULL DEFAULT 'self',
    is_verified     BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_vehicles_driver_id ON vehicles(driver_id);

CREATE TABLE driver_documents (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id     UUID          NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    doc_type      document_type NOT NULL,
    storage_path  TEXT          NOT NULL,
    public_url    TEXT,
    status        doc_status    NOT NULL DEFAULT 'pending',
    admin_note    TEXT,
    reviewed_by   UUID          REFERENCES auth.users(id),
    reviewed_at   TIMESTAMPTZ,
    uploaded_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    UNIQUE (driver_id, doc_type)
);
CREATE INDEX idx_driver_docs_driver_id ON driver_documents(driver_id);
CREATE INDEX idx_driver_docs_status    ON driver_documents(status);

CREATE TABLE driver_locations (
    driver_id   UUID             PRIMARY KEY REFERENCES drivers(id) ON DELETE CASCADE,
    latitude    DOUBLE PRECISION NOT NULL,
    longitude   DOUBLE PRECISION NOT NULL,
    heading     DOUBLE PRECISION,
    speed       DOUBLE PRECISION,
    accuracy    DOUBLE PRECISION,
    updated_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_driver_loc_coords  ON driver_locations(latitude, longitude);
CREATE INDEX idx_driver_loc_updated ON driver_locations(updated_at DESC);

CREATE TABLE ride_requests (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    rider_id         UUID         NOT NULL REFERENCES riders(id),
    vehicle_type     vehicle_type NOT NULL,
    pickup_lat       DOUBLE PRECISION NOT NULL,
    pickup_lng       DOUBLE PRECISION NOT NULL,
    pickup_address   TEXT,
    drop_lat         DOUBLE PRECISION NOT NULL,
    drop_lng         DOUBLE PRECISION NOT NULL,
    drop_address     TEXT,
    distance_km      NUMERIC(8,3),
    estimated_fare   NUMERIC(10,2),
    status           TEXT         NOT NULL DEFAULT 'searching'
                     CHECK (status IN ('searching', 'accepted', 'expired', 'cancelled')),
    expires_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW() + INTERVAL '3 minutes',
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ride_req_rider_id ON ride_requests(rider_id);
CREATE INDEX idx_ride_req_status   ON ride_requests(status);
CREATE INDEX idx_ride_req_type     ON ride_requests(vehicle_type, status);
CREATE INDEX idx_ride_req_created  ON ride_requests(created_at DESC);

CREATE TABLE trips (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id       UUID         REFERENCES ride_requests(id),
    rider_id         UUID         NOT NULL REFERENCES riders(id),
    driver_id        UUID         NOT NULL REFERENCES drivers(id),
    vehicle_id       UUID         REFERENCES vehicles(id),
    vehicle_type     vehicle_type NOT NULL,
    status           trip_status  NOT NULL DEFAULT 'accepted',
    pickup_lat       DOUBLE PRECISION NOT NULL,
    pickup_lng       DOUBLE PRECISION NOT NULL,
    pickup_address   TEXT,
    drop_lat         DOUBLE PRECISION NOT NULL,
    drop_lng         DOUBLE PRECISION NOT NULL,
    drop_address     TEXT,
    distance_km      NUMERIC(8,3),
    fare             NUMERIC(10,2),
    surge_multiplier NUMERIC(4,2)  DEFAULT 1.00,
    final_fare       NUMERIC(10,2),
    payment_method   TEXT          DEFAULT 'cash'
                     CHECK (payment_method IN ('cash', 'wallet', 'upi')),
    payment_status   TEXT          DEFAULT 'pending'
                     CHECK (payment_status IN ('pending', 'paid', 'failed')),
    accepted_at      TIMESTAMPTZ,
    arrived_at       TIMESTAMPTZ,
    started_at       TIMESTAMPTZ,
    completed_at     TIMESTAMPTZ,
    cancelled_at     TIMESTAMPTZ,
    cancelled_by     TEXT          CHECK (cancelled_by IN ('rider', 'driver', 'system')),
    cancel_reason    TEXT,
    rider_rating     SMALLINT      CHECK (rider_rating  BETWEEN 1 AND 5),
    driver_rating    SMALLINT      CHECK (driver_rating BETWEEN 1 AND 5),
    otp              TEXT,
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_trips_rider_id    ON trips(rider_id);
CREATE INDEX idx_trips_driver_id   ON trips(driver_id);
CREATE INDEX idx_trips_status      ON trips(status);
CREATE INDEX idx_trips_created     ON trips(created_at DESC);
CREATE INDEX idx_trips_driver_date ON trips(driver_id, created_at DESC);

CREATE TABLE driver_earnings (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id       UUID        NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    trip_id         UUID        NOT NULL REFERENCES trips(id)   ON DELETE CASCADE,
    gross_fare      NUMERIC(10,2) NOT NULL,
    commission_pct  NUMERIC(5,2)  NOT NULL DEFAULT 20.00,
    commission_amt  NUMERIC(10,2) NOT NULL,
    net_earning     NUMERIC(10,2) NOT NULL,
    earned_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    UNIQUE (trip_id)
);
CREATE INDEX idx_earnings_driver_id   ON driver_earnings(driver_id);
CREATE INDEX idx_earnings_driver_date ON driver_earnings(driver_id, earned_at DESC);

CREATE TABLE driver_wallets (
    driver_id     UUID          PRIMARY KEY REFERENCES drivers(id) ON DELETE CASCADE,
    balance       NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_earned  NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    total_paid    NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id     UUID         NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    trip_id       UUID         REFERENCES trips(id),
    type          txn_type     NOT NULL,
    category      txn_category NOT NULL,
    amount        NUMERIC(10,2) NOT NULL,
    balance_after NUMERIC(12,2) NOT NULL,
    description   TEXT,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_wallet_txn_driver_id   ON wallet_transactions(driver_id);
CREATE INDEX idx_wallet_txn_driver_date ON wallet_transactions(driver_id, created_at DESC);
