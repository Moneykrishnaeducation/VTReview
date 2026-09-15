VTIndex Broker Database Structure
Updated version - Related Person and Relationship Map tables removed
This document defines the broker/company, regulation, reviews, complaints, user, and broker-import database tables used by the VTIndex platform.
1.	companies
Column	Data Type	Description
id	UUID PK	Broker/Company ID
brand_name	VARCHAR(255)	Brand name
legal_name	VARCHAR(255)	Legal company name
registration_number	VARCHAR(100)	Registration number
register_region	VARCHAR(100)	Registered region
operating_period	VARCHAR(100)	Operating period
country	VARCHAR(100)	Country
jurisdiction	VARCHAR(100)	Jurisdiction
email	VARCHAR(255)	Official email
contact_number	VARCHAR(50)	Contact number
website_url	VARCHAR(1000)	Official website
verified_site	BOOLEAN	Website verified
business_region	TEXT	Operating/business regions
about_us	TEXT	About company
company_profile_description	TEXT	Company profile description
status	ENUM	Active / Inactive
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
2.	company_addresses
Column	Data Type	Description
id	UUID PK	Address ID
company_id	FK companies.id	Company
address_type	VARCHAR(50)	Registered / office / branch
address_line_1	VARCHAR(255)	Address
address_line_2	VARCHAR(255)	Address line 2
city	VARCHAR(100)	City
state	VARCHAR(100)	State
postal_code	VARCHAR(30)	Postal code
country	VARCHAR(100)	Country
is_primary	BOOLEAN	Primary address
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
3.	company_contacts
Column	Data Type	Description
id	UUID PK	Contact ID
company_id	FK companies.id	Company
contact_type	VARCHAR(50)	Contact type
email	VARCHAR(255)	Email
phone	VARCHAR(50)	Phone
website	VARCHAR(500)	Website
created_at	TIMESTAMP	Created
Column	Data Type	Description
updated_at	TIMESTAMP	Updated
4.	related_companies
Column	Data Type	Description
id	UUID PK	Relationship ID
company_id	FK companies.id	Main company
related_company_name	VARCHAR(255)	Related company name
related_company_id	FK nullable	Existing related company
relationship_type	VARCHAR(100)	Parent / Subsidiary / Affiliate / Brand
country	VARCHAR(100)	Country
registration_number	VARCHAR(100)	Registration number
website_url	VARCHAR(1000)	Website
description	TEXT	Relationship details
source_url	VARCHAR(1000)	Source
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
5.	account_information
Column	Data Type	Description
id	UUID PK	Account information ID
company_id	FK companies.id	Company
account_name	VARCHAR(255)	Account name
account_type	VARCHAR(100)	Account type
minimum_deposit	DECIMAL(18,2)	Minimum deposit
minimum_trade_size	VARCHAR(100)	Minimum trade size
maximum_leverage	VARCHAR(100)	Maximum leverage
spread	VARCHAR(100)	Spread
commission	VARCHAR(100)	Commission
base_currency	VARCHAR(50)	Base currency
description	TEXT	Account details
status	ENUM	Active / Inactive
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
6.	trading_profiles
Column	Data Type	Description
id	UUID PK	Trading profile ID
company_id	FK companies.id	Company
maximum_leverage	VARCHAR(100)	Maximum leverage
minimum_deposit	DECIMAL(18,2)	Minimum deposit
minimum_trade_size	VARCHAR(100)	Minimum trade size
minimum_spread	VARCHAR(100)	Minimum spread
commission	VARCHAR(100)	Commission
currency	VARCHAR(50)	Supported currency
trading_instruments	TEXT	Available trading instruments
trading_environment	TEXT	Trading environment
depositing_method	TEXT	Depositing methods
withdrawal_method	TEXT	Withdrawal methods
trading_strategy	TEXT	Stated trading strategy/model
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
7.	transaction_information
Column	Data Type	Description
id	UUID PK	Transaction information ID
company_id	FK companies.id	Company
transaction_type	VARCHAR(100)	Deposit / Withdrawal
method	VARCHAR(150)	Payment method
supported_currency	VARCHAR(50)	Currency
minimum_amount	DECIMAL(18,2)	Minimum amount
maximum_amount	DECIMAL(18,2)	Maximum amount
fee	VARCHAR(100)	Fee
processing_time	VARCHAR(100)	Processing time
description	TEXT	Details
source_url	VARCHAR(1000)	Source
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
8.	platforms
Column	Data Type	Description
id	UUID PK	Platform ID
company_id	FK companies.id	Company
platform_name	VARCHAR(255)	Platform name
platform_type	VARCHAR(100)	Desktop / Web / Mobile
version	VARCHAR(100)	Version
platform_url	VARCHAR(1000)	Platform link
download_url	VARCHAR(1000)	Download link
description	TEXT	Platform description
status	ENUM	Active / Inactive
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
9.	regulators
Column	Data Type	Description
id	UUID PK	Regulator ID
name	VARCHAR(255)	Regulator
short_name	VARCHAR(100)	Short name
country	VARCHAR(100)	Country
website	VARCHAR(500)	Official website
verification_url	VARCHAR(500)	Verification URL
description	TEXT	Description
status	ENUM	Active / Inactive
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
10.	licence_details
Column	Data Type	Description
id	UUID PK	Licence ID
company_id	FK companies.id	Company
regulator_id	FK regulators.id	Regulator
licence_number	VARCHAR(150)	Licence number
licence_type	VARCHAR(150)	Licence type
licence_category	VARCHAR(150)	Category
Column	Data Type	Description
issue_date	DATE	Issue date
expiry_date	DATE	Expiry date
licence_status	ENUM	Active / Expired / Suspended / Revoked / Pending
licence_scope	TEXT	Licence scope
restrictions	TEXT	Restrictions
source_url	VARCHAR(1000)	Official source
document_id	FK media.id	Evidence document
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
11.	licence_activities
Column	Data Type	Description
id	UUID PK	Activity ID
licence_id	FK licence_details.id	Licence
activity_name	VARCHAR(255)	Activity
permitted	BOOLEAN	Permitted
description	TEXT	Details
created_at	TIMESTAMP	Created
12.	verification_records
Column	Data Type	Description
id	UUID PK	Verification ID
company_id	FK companies.id	Company
licence_id	FK nullable	Licence if applicable
verification_type	VARCHAR(100)	Licence / Website / Company
verification_status	ENUM	Verified / Partially Verified / Unverified
verified_by	FK users.id	Verifier
verified_at	TIMESTAMP	Verification date
source_url	VARCHAR(1000)	Source
evidence_reference	VARCHAR(500)	Evidence reference
findings	TEXT	Findings
notes	TEXT	Internal notes
next_verification_date	DATE	Next verification
created_at	TIMESTAMP	Created
13.	website_verification
Column	Data Type	Description
id	UUID PK	Verification ID
company_id	FK companies.id	Company
website_url	VARCHAR(1000)	Website
verification_status	ENUM	Verified / Unverified
verification_method	VARCHAR(150)	DNS / Official Source / Manual
verified_by	FK users.id	Verifier
verified_at	TIMESTAMP	Verification date
source_url	VARCHAR(1000)	Source
notes	TEXT	Notes
created_at	TIMESTAMP	Created
14.	review_sources
Column	Data Type	Description
id	UUID PK	Source ID
Column	Data Type	Description
name	VARCHAR(255)	Source name
source_type	VARCHAR(100)	Review site / Regulator / News / Independent
website	VARCHAR(500)	Website
description	TEXT	Description
status	ENUM	Active / Inactive
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
15.	customer_reviews
Column	Data Type	Description
id	UUID PK	Review ID
company_id	FK companies.id	Broker
user_id	FK nullable	Customer
rating	INT	1-5  rating
title	VARCHAR(255)	Review title
content	TEXT	Review
category	VARCHAR(100)	Review category
display_name	VARCHAR(150)	Public display name
verified	BOOLEAN	Verified review
verification_method	VARCHAR(100)	Verification method
status	ENUM	Pending / Approved / Rejected / Hidden / Reported
moderation_notes	TEXT	Internal notes
moderated_by	FK users.id	Moderator
moderated_at	TIMESTAMP	Moderation date
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
16.	independent_reviews
Column	Data Type	Description
id	UUID PK	Review ID
company_id	FK companies.id	Company
source_id	FK review_sources.id	Source
title	VARCHAR(500)	Title
author	VARCHAR(255)	Author
original_url	VARCHAR(1000)	Original URL
publication_date	DATE	Publication date
rating	DECIMAL(3,2)	External rating
summary	TEXT	Neutral summary
factual_status	ENUM	Verified / Unverified / Disputed
last_checked_at	TIMESTAMP	Last checked
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
17.	review_reports
Column	Data Type	Description
id	UUID PK	Report ID
review_id	FK customer_reviews.id	Review
reported_by	FK users.id	Reporter
reason	VARCHAR(100)	Reason
description	TEXT	Details
status	ENUM	Pending / Reviewed / Resolved / Rejected
Column	Data Type	Description
reviewed_by	FK users.id	Moderator
reviewed_at	TIMESTAMP	Reviewed
resolution	TEXT	Resolution
created_at	TIMESTAMP	Created
18.	complaints
Column	Data Type	Description
id	UUID PK	Complaint ID
case_number	VARCHAR(50) UNIQUE	Public case number
company_id	FK companies.id	Broker
user_id	FK users.id	Client
category	VARCHAR(100)	Category
subject	VARCHAR(255)	Subject
issue_description	TEXT	Issue description
proof_required	BOOLEAN	Whether proof is required/submitted
priority	ENUM	Low / Medium / High / Urgent
status	ENUM	New / Assigned / Under Review / Waiting / Resolved / Closed / Rejected
assigned_to	FK users.id	Assigned admin
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
resolved_at	TIMESTAMP	Resolved
closed_at	TIMESTAMP	Closed
19.	complaint_proofs
Column	Data Type	Description
id	UUID PK	Proof ID
complaint_id	FK complaints.id	Complaint
proof_type	VARCHAR(100)	Screenshot / PDF / Email / Statement
file_id	FK media.id	Uploaded file
description	TEXT	Proof description
uploaded_by	FK users.id	Uploader
verification_status	ENUM	Pending / Verified / Rejected
verified_by	FK users.id	Verifier
verified_at	TIMESTAMP	Verified
created_at	TIMESTAMP	Created
20.	complaint_updates
Column	Data Type	Description
id	UUID PK	Update ID
complaint_id	FK complaints.id	Complaint
user_id	FK users.id	Author
update_type	VARCHAR(100)	Update type
message	TEXT	Message
is_public	BOOLEAN	Customer visible
attachment_id	FK media.id	Attachment
created_at	TIMESTAMP	Created
21.	verification_history
Column	Data Type	Description
id	UUID PK	History ID
Column	Data Type	Description
company_id	FK companies.id	Company
licence_id	FK nullable	Licence
previous_status	VARCHAR(100)	Previous status
new_status	VARCHAR(100)	New status
change_reason	TEXT	Reason
source_url	VARCHAR(1000)	Source
changed_by	FK users.id	Admin
changed_at	TIMESTAMP	Changed
22.	broker_import_batches
Column	Data Type	Description
id	UUID PK	Import batch ID
file_name	VARCHAR(500)	Uploaded file
file_type	VARCHAR(50)	CSV / XLSX
total_records	INT	Total rows
valid_records	INT	Valid rows
duplicate_records	INT	Duplicates
failed_records	INT	Failed rows
imported_records	INT	Imported rows
status	ENUM	Pending / Processing / Completed / Failed
uploaded_by	FK users.id	Admin
created_at	TIMESTAMP	Created
completed_at	TIMESTAMP	Completed
23.	broker_import_records
Column	Data Type	Description
id	UUID PK	Import record ID
batch_id	FK broker_import_batches.id	Batch
row_number	INT	Excel/CSV row
raw_data	JSON	Original row data
validation_status	ENUM	Valid / Duplicate / Invalid / Imported
validation_errors	TEXT	Validation errors
company_id	FK nullable	Created broker
created_at	TIMESTAMP	Created
24.	users
Column	Data Type	Description
id	UUID PK	User ID
email	VARCHAR(255) UNIQUE	Email
password_hash	VARCHAR(255)	Hashed password
first_name	VARCHAR(100)	First name
last_name	VARCHAR(100)	Last name
phone	VARCHAR(30)	Phone
status	ENUM	Active / Suspended / Blocked
email_verified	BOOLEAN	Verification status
last_login_at	TIMESTAMP	Last login
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
25.	roles
Column	Data Type	Description
id	PK	Role ID
name	VARCHAR(100)	Role name
description	TEXT	Description
created_at	TIMESTAMP	Created
updated_at	TIMESTAMP	Updated
26.	permissions
Column	Data Type	Description
id	PK	Permission ID
code	VARCHAR(150) UNIQUE	Permission code
name	VARCHAR(150)	Permission name
description	TEXT	Description
module	VARCHAR(100)	Module
27.	user_roles
Column	Data Type	Description
id	PK	ID
user_id	FK users.id	User
role_id	FK roles.id	Role
created_at	TIMESTAMP	Created
28.	role_permissions
Column	Data Type	Description
id	PK	ID
role_id	FK roles.id	Role
permission_id	FK permissions.id	Permission
created_at	TIMESTAMP	Created
29.	admin_sessions
Column	Data Type	Description
id	UUID PK	Session ID
user_id	FK users.id	Admin user
token_hash	VARCHAR(500)	Hashed token
ip_address	VARCHAR(50)	IP
user_agent	TEXT	Browser/device
expires_at	TIMESTAMP	Expiry
revoked_at	TIMESTAMP	Revoked
created_at	TIMESTAMP	Created
30.	media
Column	Data Type	Description
id	UUID PK	Media ID
file_name	VARCHAR(500)	Stored filename
original_name	VARCHAR(500)	Original filename
file_type	VARCHAR(100)	File type
mime_type	VARCHAR(100)	MIME type
file_size	BIGINT	File size
storage_path	VARCHAR(1000)	Storage path
url	VARCHAR(1000)	URL
uploaded_by	FK users.id	Uploader
created_at	TIMESTAMP	Created
31.	audit_logs
Column	Data Type	Description
id	UUID PK	Audit ID
user_id	FK users.id	Actor
action	VARCHAR(100)	Action
module	VARCHAR(100)	Module
entity_type	VARCHAR(100)	Entity type
entity_id	UUID	Entity ID
old_values	JSON	Previous values
new_values	JSON	New values
ip_address	VARCHAR(50)	IP
user_agent	TEXT	User agent
created_at	TIMESTAMP	Created
Removed Tables
The following tables are intentionally excluded from this version: related_persons and relationship_map.
Note: The relationship map should be generated in the frontend from related_companies data rather than stored as a separate table.
