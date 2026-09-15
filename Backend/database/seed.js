const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

const createTablesAndSeed = async () => {
  try {
    console.log('Starting Full Auto-Seeder...');
    
    // 1. Setup Extensions
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    
    // 2. Setup Enums (safely)
    const enums = [
      `CREATE TYPE company_status AS ENUM ('Active', 'Inactive');`,
      `CREATE TYPE user_status AS ENUM ('Active', 'Suspended', 'Blocked');`,
      `CREATE TYPE licence_status_enum AS ENUM ('Active', 'Expired', 'Suspended', 'Revoked', 'Pending');`,
      `CREATE TYPE verification_status_enum AS ENUM ('Verified', 'Partially Verified', 'Unverified');`,
      `CREATE TYPE review_status_enum AS ENUM ('Pending', 'Approved', 'Rejected', 'Hidden', 'Reported');`,
      `CREATE TYPE complaint_priority AS ENUM ('Low', 'Medium', 'High', 'Urgent');`,
      `CREATE TYPE complaint_status AS ENUM ('New', 'Assigned', 'Under Review', 'Waiting', 'Resolved', 'Closed', 'Rejected');`,
      `CREATE TYPE import_batch_status AS ENUM ('Pending', 'Processing', 'Completed', 'Failed');`
    ];

    for (const enumQuery of enums) {
      try { await pool.query(enumQuery); } catch (e) { /* Enum already exists */ }
    }
    
    // 3. Create Tables
    console.log('Creating all 31 tables...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          phone VARCHAR(30),
          status user_status DEFAULT 'Active',
          email_verified BOOLEAN DEFAULT FALSE,
          last_login_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS roles (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS permissions (
          id SERIAL PRIMARY KEY,
          code VARCHAR(150) UNIQUE NOT NULL,
          name VARCHAR(150),
          description TEXT,
          module VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS user_roles (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          role_id INT REFERENCES roles(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, role_id)
      );

      CREATE TABLE IF NOT EXISTS role_permissions (
          id SERIAL PRIMARY KEY,
          role_id INT REFERENCES roles(id) ON DELETE CASCADE,
          permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(role_id, permission_id)
      );

      CREATE TABLE IF NOT EXISTS media (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          file_name VARCHAR(500),
          original_name VARCHAR(500),
          file_type VARCHAR(100),
          mime_type VARCHAR(100),
          file_size BIGINT,
          storage_path VARCHAR(1000),
          url VARCHAR(1000),
          uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS companies (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          brand_name VARCHAR(255),
          legal_name VARCHAR(255),
          registration_number VARCHAR(100),
          register_region VARCHAR(100),
          operating_period VARCHAR(100),
          country VARCHAR(100),
          jurisdiction VARCHAR(100),
          email VARCHAR(255),
          contact_number VARCHAR(50),
          website_url VARCHAR(1000),
          verified_site BOOLEAN,
          business_region TEXT,
          about_us TEXT,
          company_profile_description TEXT,
          status company_status DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS company_addresses (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          address_type VARCHAR(50),
          address_line_1 VARCHAR(255),
          address_line_2 VARCHAR(255),
          city VARCHAR(100),
          state VARCHAR(100),
          postal_code VARCHAR(30),
          country VARCHAR(100),
          is_primary BOOLEAN,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS company_contacts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          contact_type VARCHAR(50),
          email VARCHAR(255),
          phone VARCHAR(50),
          website VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS related_companies (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          related_company_name VARCHAR(255),
          related_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
          relationship_type VARCHAR(100),
          country VARCHAR(100),
          registration_number VARCHAR(100),
          website_url VARCHAR(1000),
          description TEXT,
          source_url VARCHAR(1000),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS account_information (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          account_name VARCHAR(255),
          account_type VARCHAR(100),
          minimum_deposit DECIMAL(18,2),
          minimum_trade_size VARCHAR(100),
          maximum_leverage VARCHAR(100),
          spread VARCHAR(100),
          commission VARCHAR(100),
          base_currency VARCHAR(50),
          description TEXT,
          status company_status DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS trading_profiles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          maximum_leverage VARCHAR(100),
          minimum_deposit DECIMAL(18,2),
          minimum_trade_size VARCHAR(100),
          minimum_spread VARCHAR(100),
          commission VARCHAR(100),
          currency VARCHAR(50),
          trading_instruments TEXT,
          trading_environment TEXT,
          depositing_method TEXT,
          withdrawal_method TEXT,
          trading_strategy TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transaction_information (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          transaction_type VARCHAR(100),
          method VARCHAR(150),
          supported_currency VARCHAR(50),
          minimum_amount DECIMAL(18,2),
          maximum_amount DECIMAL(18,2),
          fee VARCHAR(100),
          processing_time VARCHAR(100),
          description TEXT,
          source_url VARCHAR(1000),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS platforms (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          platform_name VARCHAR(255),
          platform_type VARCHAR(100),
          version VARCHAR(100),
          platform_url VARCHAR(1000),
          download_url VARCHAR(1000),
          description TEXT,
          status company_status DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS regulators (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255),
          short_name VARCHAR(100),
          country VARCHAR(100),
          website VARCHAR(500),
          verification_url VARCHAR(500),
          description TEXT,
          status company_status DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS licence_details (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          regulator_id UUID REFERENCES regulators(id) ON DELETE CASCADE,
          licence_number VARCHAR(150),
          licence_type VARCHAR(150),
          licence_category VARCHAR(150),
          issue_date DATE,
          expiry_date DATE,
          licence_status licence_status_enum,
          licence_scope TEXT,
          restrictions TEXT,
          source_url VARCHAR(1000),
          document_id UUID REFERENCES media(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS licence_activities (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          licence_id UUID REFERENCES licence_details(id) ON DELETE CASCADE,
          activity_name VARCHAR(255),
          permitted BOOLEAN,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS verification_records (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          licence_id UUID REFERENCES licence_details(id) ON DELETE CASCADE,
          verification_type VARCHAR(100),
          verification_status verification_status_enum,
          verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
          verified_at TIMESTAMP,
          source_url VARCHAR(1000),
          evidence_reference VARCHAR(500),
          findings TEXT,
          notes TEXT,
          next_verification_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS website_verification (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          website_url VARCHAR(1000),
          verification_status verification_status_enum,
          verification_method VARCHAR(150),
          verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
          verified_at TIMESTAMP,
          source_url VARCHAR(1000),
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS review_sources (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255),
          source_type VARCHAR(100),
          website VARCHAR(500),
          description TEXT,
          status company_status DEFAULT 'Active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS customer_reviews (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          rating INT,
          title VARCHAR(255),
          content TEXT,
          category VARCHAR(100),
          display_name VARCHAR(150),
          verified BOOLEAN,
          verification_method VARCHAR(100),
          status review_status_enum DEFAULT 'Pending',
          moderation_notes TEXT,
          moderated_by UUID REFERENCES users(id) ON DELETE SET NULL,
          moderated_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS independent_reviews (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          source_id UUID REFERENCES review_sources(id) ON DELETE CASCADE,
          title VARCHAR(500),
          author VARCHAR(255),
          original_url VARCHAR(1000),
          publication_date DATE,
          rating DECIMAL(3,2),
          summary TEXT,
          factual_status verification_status_enum,
          last_checked_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS review_reports (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          review_id UUID REFERENCES customer_reviews(id) ON DELETE CASCADE,
          reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
          reason VARCHAR(100),
          description TEXT,
          status complaint_status DEFAULT 'New',
          reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
          reviewed_at TIMESTAMP,
          resolution TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS complaints (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          case_number VARCHAR(50) UNIQUE,
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          category VARCHAR(100),
          subject VARCHAR(255),
          issue_description TEXT,
          proof_required BOOLEAN,
          priority complaint_priority,
          status complaint_status DEFAULT 'New',
          assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          resolved_at TIMESTAMP,
          closed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS complaint_proofs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
          proof_type VARCHAR(100),
          file_id UUID REFERENCES media(id) ON DELETE SET NULL,
          description TEXT,
          uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
          verification_status verification_status_enum,
          verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
          verified_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS complaint_updates (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          update_type VARCHAR(100),
          message TEXT,
          is_public BOOLEAN,
          attachment_id UUID REFERENCES media(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS verification_history (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          licence_id UUID REFERENCES licence_details(id) ON DELETE CASCADE,
          previous_status VARCHAR(100),
          new_status VARCHAR(100),
          change_reason TEXT,
          source_url VARCHAR(1000),
          changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
          changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS broker_import_batches (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          file_name VARCHAR(500),
          file_type VARCHAR(50),
          total_records INT,
          valid_records INT,
          duplicate_records INT,
          failed_records INT,
          imported_records INT,
          status import_batch_status DEFAULT 'Pending',
          uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS broker_import_records (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          batch_id UUID REFERENCES broker_import_batches(id) ON DELETE CASCADE,
          row_number INT,
          raw_data JSON,
          validation_status VARCHAR(100),
          validation_errors TEXT,
          company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_sessions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          token_hash VARCHAR(500),
          ip_address VARCHAR(50),
          user_agent TEXT,
          expires_at TIMESTAMP,
          revoked_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE SET NULL,
          action VARCHAR(100),
          module VARCHAR(100),
          entity_type VARCHAR(100),
          entity_id UUID,
          old_values JSON,
          new_values JSON,
          ip_address VARCHAR(50),
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Seed Default Data
    console.log('Seeding initial data...');
    
    await pool.query(`
      INSERT INTO roles (name, description) VALUES 
      ('Admin', 'Super administrator with full access'),
      ('Viewer', 'Public viewer or standard user')
      ON CONFLICT (name) DO NOTHING;
    `);

    const adminUser = await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, status) 
      VALUES ('admin@vtindex.com', 'hashed_password_placeholder', 'Super', 'Admin', 'Active')
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `);

    if (adminUser.rows.length > 0) {
      const adminId = adminUser.rows[0].id;
      const adminRole = await pool.query(`SELECT id FROM roles WHERE name = 'Admin'`);
      await pool.query(`
        INSERT INTO user_roles (user_id, role_id) 
        VALUES ($1, $2) ON CONFLICT DO NOTHING;
      `, [adminId, adminRole.rows[0].id]);
      console.log('Default Admin user created: admin@vtindex.com');
    }

    console.log('Full Auto-Seeder completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await pool.end();
  }
};

createTablesAndSeed();
