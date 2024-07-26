export default [
  {
    "statements": [
      "CREATE TABLE contacts (\n    id uuid NOT NULL,\n    first_name text,\n    last_name text,\n    website text,\n    avatar text,\n    notes text,\n    CONSTRAINT contacts_pkey PRIMARY KEY (id)\n);\n\n\n",
      "INSERT INTO \"public\".\"_electric_trigger_settings\" (\"namespace\", \"tablename\", \"flag\")\n  VALUES ('public', 'contacts', 1)\n  ON CONFLICT DO NOTHING;",
      "DROP TRIGGER IF EXISTS update_ensure_public_contacts_primarykey ON \"public\".\"contacts\";",
      "CREATE OR REPLACE FUNCTION update_ensure_public_contacts_primarykey_function()\nRETURNS TRIGGER AS $$\nBEGIN\n  IF OLD.\"id\" IS DISTINCT FROM NEW.\"id\" THEN\n    RAISE EXCEPTION 'Cannot change the value of column id as it belongs to the primary key';\n  END IF;\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;",
      "CREATE TRIGGER update_ensure_public_contacts_primarykey\n  BEFORE UPDATE ON \"public\".\"contacts\"\n    FOR EACH ROW\n      EXECUTE FUNCTION update_ensure_public_contacts_primarykey_function();",
      "DROP TRIGGER IF EXISTS insert_public_contacts_into_oplog ON \"public\".\"contacts\";",
      "    CREATE OR REPLACE FUNCTION insert_public_contacts_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'contacts';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'contacts',\n            'INSERT',\n            json_strip_nulls(json_build_object('id', new.\"id\")),\n            jsonb_build_object('avatar', new.\"avatar\", 'first_name', new.\"first_name\", 'id', new.\"id\", 'last_name', new.\"last_name\", 'notes', new.\"notes\", 'website', new.\"website\"),\n            NULL,\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER insert_public_contacts_into_oplog\n  AFTER INSERT ON \"public\".\"contacts\"\n    FOR EACH ROW\n      EXECUTE FUNCTION insert_public_contacts_into_oplog_function();",
      "DROP TRIGGER IF EXISTS update_public_contacts_into_oplog ON \"public\".\"contacts\";",
      "    CREATE OR REPLACE FUNCTION update_public_contacts_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'contacts';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'contacts',\n            'UPDATE',\n            json_strip_nulls(json_build_object('id', new.\"id\")),\n            jsonb_build_object('avatar', new.\"avatar\", 'first_name', new.\"first_name\", 'id', new.\"id\", 'last_name', new.\"last_name\", 'notes', new.\"notes\", 'website', new.\"website\"),\n            jsonb_build_object('avatar', old.\"avatar\", 'first_name', old.\"first_name\", 'id', old.\"id\", 'last_name', old.\"last_name\", 'notes', old.\"notes\", 'website', old.\"website\"),\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER update_public_contacts_into_oplog\n  AFTER UPDATE ON \"public\".\"contacts\"\n    FOR EACH ROW\n      EXECUTE FUNCTION update_public_contacts_into_oplog_function();",
      "DROP TRIGGER IF EXISTS delete_public_contacts_into_oplog ON \"public\".\"contacts\";",
      "    CREATE OR REPLACE FUNCTION delete_public_contacts_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'contacts';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'contacts',\n            'DELETE',\n            json_strip_nulls(json_build_object('id', old.\"id\")),\n            NULL,\n            jsonb_build_object('avatar', old.\"avatar\", 'first_name', old.\"first_name\", 'id', old.\"id\", 'last_name', old.\"last_name\", 'notes', old.\"notes\", 'website', old.\"website\"),\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER delete_public_contacts_into_oplog\n  AFTER DELETE ON \"public\".\"contacts\"\n    FOR EACH ROW\n      EXECUTE FUNCTION delete_public_contacts_into_oplog_function();"
    ],
    "version": "1"
  },
  {
    "statements": [
      "CREATE TABLE favorite_contacts (\n    id uuid NOT NULL,\n    user_id uuid NOT NULL,\n    contact_id uuid NOT NULL,\n    CONSTRAINT favorite_contacts_pkey PRIMARY KEY (id),\n    CONSTRAINT favorite_contacts_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES contacts(id)\n);\n\n\n",
      "INSERT INTO \"public\".\"_electric_trigger_settings\" (\"namespace\", \"tablename\", \"flag\")\n  VALUES ('public', 'favorite_contacts', 1)\n  ON CONFLICT DO NOTHING;",
      "DROP TRIGGER IF EXISTS update_ensure_public_favorite_contacts_primarykey ON \"public\".\"favorite_contacts\";",
      "CREATE OR REPLACE FUNCTION update_ensure_public_favorite_contacts_primarykey_function()\nRETURNS TRIGGER AS $$\nBEGIN\n  IF OLD.\"id\" IS DISTINCT FROM NEW.\"id\" THEN\n    RAISE EXCEPTION 'Cannot change the value of column id as it belongs to the primary key';\n  END IF;\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;",
      "CREATE TRIGGER update_ensure_public_favorite_contacts_primarykey\n  BEFORE UPDATE ON \"public\".\"favorite_contacts\"\n    FOR EACH ROW\n      EXECUTE FUNCTION update_ensure_public_favorite_contacts_primarykey_function();",
      "DROP TRIGGER IF EXISTS insert_public_favorite_contacts_into_oplog ON \"public\".\"favorite_contacts\";",
      "    CREATE OR REPLACE FUNCTION insert_public_favorite_contacts_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'favorite_contacts';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'favorite_contacts',\n            'INSERT',\n            json_strip_nulls(json_build_object('id', new.\"id\")),\n            jsonb_build_object('contact_id', new.\"contact_id\", 'id', new.\"id\", 'user_id', new.\"user_id\"),\n            NULL,\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER insert_public_favorite_contacts_into_oplog\n  AFTER INSERT ON \"public\".\"favorite_contacts\"\n    FOR EACH ROW\n      EXECUTE FUNCTION insert_public_favorite_contacts_into_oplog_function();",
      "DROP TRIGGER IF EXISTS update_public_favorite_contacts_into_oplog ON \"public\".\"favorite_contacts\";",
      "    CREATE OR REPLACE FUNCTION update_public_favorite_contacts_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'favorite_contacts';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'favorite_contacts',\n            'UPDATE',\n            json_strip_nulls(json_build_object('id', new.\"id\")),\n            jsonb_build_object('contact_id', new.\"contact_id\", 'id', new.\"id\", 'user_id', new.\"user_id\"),\n            jsonb_build_object('contact_id', old.\"contact_id\", 'id', old.\"id\", 'user_id', old.\"user_id\"),\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER update_public_favorite_contacts_into_oplog\n  AFTER UPDATE ON \"public\".\"favorite_contacts\"\n    FOR EACH ROW\n      EXECUTE FUNCTION update_public_favorite_contacts_into_oplog_function();",
      "DROP TRIGGER IF EXISTS delete_public_favorite_contacts_into_oplog ON \"public\".\"favorite_contacts\";",
      "    CREATE OR REPLACE FUNCTION delete_public_favorite_contacts_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n      BEGIN\n        -- Get the flag value from _electric_trigger_settings\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'favorite_contacts';\n\n        IF flag_value = 1 THEN\n          -- Insert into _electric_oplog\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          VALUES (\n            'public',\n            'favorite_contacts',\n            'DELETE',\n            json_strip_nulls(json_build_object('id', old.\"id\")),\n            NULL,\n            jsonb_build_object('contact_id', old.\"contact_id\", 'id', old.\"id\", 'user_id', old.\"user_id\"),\n            NULL\n          );\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER delete_public_favorite_contacts_into_oplog\n  AFTER DELETE ON \"public\".\"favorite_contacts\"\n    FOR EACH ROW\n      EXECUTE FUNCTION delete_public_favorite_contacts_into_oplog_function();",
      "DROP TRIGGER IF EXISTS compensation_insert_public_favorite_contacts_contact_id_into_oplog ON \"public\".\"favorite_contacts\";",
      "    CREATE OR REPLACE FUNCTION compensation_insert_public_favorite_contacts_contact_id_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n        meta_value INTEGER;\n      BEGIN\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'favorite_contacts';\n\n        SELECT value INTO meta_value FROM \"public\"._electric_meta WHERE key = 'compensations';\n\n        IF flag_value = 1 AND meta_value = 1 THEN\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          SELECT\n            'public',\n            'contacts',\n            'COMPENSATION',\n            json_strip_nulls(json_strip_nulls(json_build_object('id', \"id\"))),\n            jsonb_build_object('id', \"id\"),\n            NULL,\n            NULL\n          FROM \"public\".\"contacts\"\n          WHERE \"id\" = NEW.\"contact_id\";\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER compensation_insert_public_favorite_contacts_contact_id_into_oplog\n  AFTER INSERT ON \"public\".\"favorite_contacts\"\n    FOR EACH ROW\n      EXECUTE FUNCTION compensation_insert_public_favorite_contacts_contact_id_into_oplog_function();",
      "DROP TRIGGER IF EXISTS compensation_update_public_favorite_contacts_contact_id_into_oplog ON \"public\".\"favorite_contacts\";",
      "    CREATE OR REPLACE FUNCTION compensation_update_public_favorite_contacts_contact_id_into_oplog_function()\n    RETURNS TRIGGER AS $$\n    BEGIN\n      DECLARE\n        flag_value INTEGER;\n        meta_value INTEGER;\n      BEGIN\n        SELECT flag INTO flag_value FROM \"public\"._electric_trigger_settings WHERE namespace = 'public' AND tablename = 'favorite_contacts';\n\n        SELECT value INTO meta_value FROM \"public\"._electric_meta WHERE key = 'compensations';\n\n        IF flag_value = 1 AND meta_value = 1 THEN\n          INSERT INTO \"public\"._electric_oplog (namespace, tablename, optype, \"primaryKey\", \"newRow\", \"oldRow\", timestamp)\n          SELECT\n            'public',\n            'contacts',\n            'COMPENSATION',\n            json_strip_nulls(json_strip_nulls(json_build_object('id', \"id\"))),\n            jsonb_build_object('id', \"id\"),\n            NULL,\n            NULL\n          FROM \"public\".\"contacts\"\n          WHERE \"id\" = NEW.\"contact_id\";\n        END IF;\n\n        RETURN NEW;\n      END;\n    END;\n    $$ LANGUAGE plpgsql;",
      "CREATE TRIGGER compensation_update_public_favorite_contacts_contact_id_into_oplog\n  AFTER UPDATE ON \"public\".\"favorite_contacts\"\n    FOR EACH ROW\n      EXECUTE FUNCTION compensation_update_public_favorite_contacts_contact_id_into_oplog_function();"
    ],
    "version": "2"
  }
]