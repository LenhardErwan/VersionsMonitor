CREATE SCHEMA versionsmonitor;

CREATE TABLE "versionsmonitor"."monitor" (
    id SERIAL NOT NULL,
    name varchar(30) NOT NULL,
    url varchar(255) NOT NULL,
    selector varchar(255) NOT NULL,
    regex varchar(50) DEFAULT NULL,
    image varchar(255) DEFAULT NULL,

		CONSTRAINT m_pk_id PRIMARY KEY (id)
);

CREATE TABLE "versionsmonitor"."version" (
    id SERIAL NOT NULL,
    monitor_id integer NOT NULL,
    value varchar(255) NOT NULL,
    discovery_timestamp timestamp NOT NULL,

		CONSTRAINT v_pk_id PRIMARY KEY (id),
		CONSTRAINT v_fk_monitor_id FOREIGN KEY (monitor_id) REFERENCES "versionsmonitor"."monitor"(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "versionsmonitor"."header" (
    id SERIAL NOT NULL,
		title varchar(50) NOT NULL,
    value varchar(255) NOT NULL,

		CONSTRAINT h_pk_id PRIMARY KEY (id)
);

CREATE TABLE "versionsmonitor"."monitorheader" (
	monitor_id integer NOT NULL,
	header_id integer NOT NULL,

	CONSTRAINT mh_pk_id PRIMARY KEY (monitor_id, header_id),
	CONSTRAINT mh_fk_monitor_id FOREIGN KEY (monitor_id) REFERENCES "versionsmonitor"."monitor"(id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT mh_fk_header_id FOREIGN KEY (header_id) REFERENCES "versionsmonitor"."header"(id) ON UPDATE CASCADE ON DELETE CASCADE
);