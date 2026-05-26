-- Seed/upsert the 20 sandbox stocks with parody names (covers both fresh prod DB
-- and dev DBs already populated with the previous names) and patch existing
-- SandboxState JSON payloads so positions, historique and candles keep
-- referencing the right tickers.

INSERT INTO "SandboxStock" (id, name, secteur, price) VALUES
    (1,  'Exxoon Mobeil',       'Énergie',         187.42),
    (2,  'FedDex Express',      'Logistique',       43.17),
    (3,  'Lui Viton',           'Luxe',            312.89),
    (4,  'Faizer',              'Santé',            78.56),
    (5,  'Booying',             'Aérospatial',     524.30),
    (6,  'Goougle',             'Tech',            256.74),
    (7,  'Goldmann Saxo',       'Finance',          91.03),
    (8,  'Veaulia',             'Environnement',    34.21),
    (9,  'Teslaaa Motors',      'Automobile',      148.90),
    (10, 'Netfloox',            'Média',            62.38),
    (11, 'Bostonn Dynamix',     'Tech',            203.15),
    (12, 'Rio Pinto',           'Matériaux',        55.67),
    (13, 'AstraZinéka',         'Santé',           119.44),
    (14, 'Microflop',           'Tech',            174.82),
    (15, 'John Beere',          'Agriculture',      28.93),
    (16, 'Envidia',             'Tech',            389.56),
    (17, 'Orang''eade Telecom', 'Télécom',          67.19),
    (18, 'Nontendo',            'Divertissement',   42.85),
    (19, 'Sun-Pouvoir',         'Énergie',          96.71),
    (20, 'Genial Electrik',     'Industrie',       158.03)
ON CONFLICT (id) DO UPDATE SET
    name    = EXCLUDED.name,
    secteur = EXCLUDED.secteur,
    price   = EXCLUDED.price;

SELECT setval(
    pg_get_serial_sequence('"SandboxStock"', 'id'),
    GREATEST((SELECT MAX(id) FROM "SandboxStock"), 1)
);

DO $$
DECLARE
    r record;
    old_q text;
    new_q text;
BEGIN
    FOR r IN
        SELECT * FROM (VALUES
            ('Nova Energies',         'Exxoon Mobeil'),
            ('Zephyr Supply Co.',     'FedDex Express'),
            ('Luxara Holdings',       'Lui Viton'),
            ('Corvex Biotech',        'Faizer'),
            ('Orbion Aerospace',      'Booying'),
            ('Matrixa AI',            'Goougle'),
            ('Fonder Finance',        'Goldmann Saxo'),
            ('Aquasphere Inc.',       'Veaulia'),
            ('Vulkan Motors',         'Teslaaa Motors'),
            ('Pulsar Media',          'Netfloox'),
            ('Kinnetix Robotics',     'Bostonn Dynamix'),
            ('Silver Peak Mining',    'Rio Pinto'),
            ('Horizon Pharma',        'AstraZinéka'),
            ('CloudStax',             'Microflop'),
            ('Terrain Agritech',      'John Beere'),
            ('Nexon Semiconductors',  'Envidia'),
            ('Borealis Telecom',      'Orang''eade Telecom'),
            ('Pyra Games',            'Nontendo'),
            ('GreenArc Solar',        'Sun-Pouvoir'),
            ('Dominex Corp.',         'Genial Electrik')
        ) AS t(old_name, new_name)
    LOOP
        old_q := '"' || r.old_name || '"';
        new_q := '"' || r.new_name || '"';

        UPDATE "SandboxState"
        SET positions  = REPLACE(positions::text,  old_q, new_q)::jsonb,
            historique = REPLACE(historique::text, old_q, new_q)::jsonb,
            candles    = REPLACE(candles::text,    old_q, new_q)::jsonb
        WHERE positions::text  LIKE '%' || old_q || '%'
           OR historique::text LIKE '%' || old_q || '%'
           OR candles::text    LIKE '%' || old_q || '%';
    END LOOP;
END $$;
