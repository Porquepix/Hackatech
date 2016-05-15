--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

--
-- Name: plpgsql; Type: PROCEDURAL LANGUAGE; Schema: -; Owner: postgres
--

CREATE OR REPLACE PROCEDURAL LANGUAGE plpgsql;


ALTER PROCEDURAL LANGUAGE plpgsql OWNER TO postgres;

SET search_path = public, pg_catalog;

--
-- Name: pc_check_max_members_orga(); Type: FUNCTION; Schema: public; Owner: alexisanomdb
--

CREATE FUNCTION pc_check_max_members_orga() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    v_MemberCount INTEGER;
    c_MaxMemberCount INTEGER;
BEGIN
    c_MaxMemberCount := 9;

    SELECT COUNT(1) INTO v_MemberCount
    FROM involve 
    WHERE organization_id = NEW.organization_id;

    IF v_MemberCount >= c_MaxMemberCount THEN
        RAISE EXCEPTION 'Too many members !';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.pc_check_max_members_orga() OWNER TO alexisanomdb;

--
-- Name: pc_check_max_participants(); Type: FUNCTION; Schema: public; Owner: alexisanomdb
--

CREATE FUNCTION pc_check_max_participants() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    v_ParticipantCount INTEGER;
    v_MaxParticipantCount INTEGER;
BEGIN
    SELECT max_participant INTO v_MaxParticipantCount
    FROM hackathons
    WHERE id = NEW.hackathon_id;

    SELECT COUNT(1) INTO v_ParticipantCount
    FROM participate 
    WHERE hackathon_id = NEW.hackathon_id;

    IF v_ParticipantCount >= v_MaxParticipantCount THEN
        RAISE EXCEPTION 'Too many participants !';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.pc_check_max_participants() OWNER TO alexisanomdb;

--
-- Name: pc_check_max_participants_per_team(); Type: FUNCTION; Schema: public; Owner: alexisanomdb
--

CREATE FUNCTION pc_check_max_participants_per_team() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
    v_ParticipantPTCount INTEGER;
    v_MaxParticipantPTCount INTEGER;
BEGIN
    SELECT max_participant_per_team INTO v_MaxParticipantPTCount
    FROM hackathons
    WHERE id = NEW.hackathon_id;

    SELECT COUNT(1) INTO v_ParticipantPTCount
    FROM public.join 
    WHERE project_id = NEW.project_id;

    IF v_ParticipantPTCount >= v_MaxParticipantPTCount THEN
        RAISE EXCEPTION 'This team is already full !';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.pc_check_max_participants_per_team() OWNER TO alexisanomdb;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: hackathons; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE hackathons (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    private_section text,
    max_participant integer NOT NULL,
    max_participant_per_team integer NOT NULL,
    place_adr character varying(255) NOT NULL,
    beginning timestamp without time zone NOT NULL,
    ending timestamp without time zone NOT NULL,
    facebook character varying(255),
    twitter character varying(255),
    organization_id bigint NOT NULL,
    github character varying(255),
    abstract character varying(150) NOT NULL
);


ALTER TABLE public.hackathons OWNER TO alexisanomdb;

--
-- Name: hackathons_id_seq; Type: SEQUENCE; Schema: public; Owner: alexisanomdb
--

CREATE SEQUENCE hackathons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hackathons_id_seq OWNER TO alexisanomdb;

--
-- Name: hackathons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: alexisanomdb
--

ALTER SEQUENCE hackathons_id_seq OWNED BY hackathons.id;


--
-- Name: involve; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE involve (
    organization_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.involve OWNER TO alexisanomdb;

--
-- Name: join; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE "join" (
    project_id bigint NOT NULL,
    user_id bigint NOT NULL,
    validate boolean DEFAULT false NOT NULL
);


ALTER TABLE public."join" OWNER TO alexisanomdb;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE migrations (
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO alexisanomdb;

--
-- Name: news; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE news (
    id bigint NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    name character varying(255) NOT NULL,
    content text NOT NULL,
    hackathon_id bigint NOT NULL
);


ALTER TABLE public.news OWNER TO alexisanomdb;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: alexisanomdb
--

CREATE SEQUENCE news_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.news_id_seq OWNER TO alexisanomdb;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: alexisanomdb
--

ALTER SEQUENCE news_id_seq OWNED BY news.id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE organizations (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    facebook character varying(255),
    twitter character varying(255),
    admin_id bigint NOT NULL,
    github character varying(255)
);


ALTER TABLE public.organizations OWNER TO alexisanomdb;

--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: alexisanomdb
--

CREATE SEQUENCE organizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organizations_id_seq OWNER TO alexisanomdb;

--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: alexisanomdb
--

ALTER SEQUENCE organizations_id_seq OWNED BY organizations.id;


--
-- Name: participate; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE participate (
    hackathon_id bigint NOT NULL,
    user_id bigint NOT NULL,
    attending boolean DEFAULT false NOT NULL
);


ALTER TABLE public.participate OWNER TO alexisanomdb;

--
-- Name: password_resets; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE password_resets (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.password_resets OWNER TO alexisanomdb;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE projects (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    private_section text,
    github character varying(255),
    hackathon_id bigint NOT NULL,
    facebook character varying(255),
    twitter character varying(255),
    admin_id bigint NOT NULL
);


ALTER TABLE public.projects OWNER TO alexisanomdb;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: alexisanomdb
--

CREATE SEQUENCE projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.projects_id_seq OWNER TO alexisanomdb;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: alexisanomdb
--

ALTER SEQUENCE projects_id_seq OWNED BY projects.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    facebook character varying(255),
    twitter character varying(255),
    github character varying(255)
);


ALTER TABLE public.users OWNER TO alexisanomdb;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: alexisanomdb
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO alexisanomdb;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: alexisanomdb
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: vote; Type: TABLE; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE TABLE vote (
    user_id bigint NOT NULL,
    project_id bigint NOT NULL,
    note integer,
    CONSTRAINT note_check CHECK (((0 <= note) AND (note <= 20)))
);


ALTER TABLE public.vote OWNER TO alexisanomdb;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY hackathons ALTER COLUMN id SET DEFAULT nextval('hackathons_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY news ALTER COLUMN id SET DEFAULT nextval('news_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY organizations ALTER COLUMN id SET DEFAULT nextval('organizations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY projects ALTER COLUMN id SET DEFAULT nextval('projects_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: hackathons_pkey; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY hackathons
    ADD CONSTRAINT hackathons_pkey PRIMARY KEY (id);


--
-- Name: involve_pkey; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY involve
    ADD CONSTRAINT involve_pkey PRIMARY KEY (organization_id, user_id);


--
-- Name: join_pk; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY "join"
    ADD CONSTRAINT join_pk PRIMARY KEY (project_id, user_id);


--
-- Name: news_pkey; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: organizations_email_key; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY organizations
    ADD CONSTRAINT organizations_email_key UNIQUE (email);


--
-- Name: organizations_name_key; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY organizations
    ADD CONSTRAINT organizations_name_key UNIQUE (name);


--
-- Name: organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: participate_pkey; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY participate
    ADD CONSTRAINT participate_pkey PRIMARY KEY (hackathon_id, user_id);


--
-- Name: projects_pkey; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: users_email_key; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vote_pk; Type: CONSTRAINT; Schema: public; Owner: alexisanomdb; Tablespace: 
--

ALTER TABLE ONLY vote
    ADD CONSTRAINT vote_pk PRIMARY KEY (user_id, project_id);


--
-- Name: hackathons_hackathons_organization_id_foreign; Type: INDEX; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE INDEX hackathons_hackathons_organization_id_foreign ON hackathons USING btree (organization_id);


--
-- Name: involve_involve_user_id_foreign; Type: INDEX; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE INDEX involve_involve_user_id_foreign ON involve USING btree (user_id);


--
-- Name: news_news_hackathon_id_foreign; Type: INDEX; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE INDEX news_news_hackathon_id_foreign ON news USING btree (hackathon_id);


--
-- Name: organizations_organizations_admin_id_foreign; Type: INDEX; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE INDEX organizations_organizations_admin_id_foreign ON organizations USING btree (admin_id);


--
-- Name: participate_participate_user_id_foreign; Type: INDEX; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE INDEX participate_participate_user_id_foreign ON participate USING btree (user_id);


--
-- Name: password_resets_password_resets_email_index; Type: INDEX; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE INDEX password_resets_password_resets_email_index ON password_resets USING btree (email);


--
-- Name: password_resets_password_resets_token_index; Type: INDEX; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE INDEX password_resets_password_resets_token_index ON password_resets USING btree (token);


--
-- Name: projects_projects_hackathon_id_foreign; Type: INDEX; Schema: public; Owner: alexisanomdb; Tablespace: 
--

CREATE INDEX projects_projects_hackathon_id_foreign ON projects USING btree (hackathon_id);


--
-- Name: tg_check_max_members_orga; Type: TRIGGER; Schema: public; Owner: alexisanomdb
--

CREATE TRIGGER tg_check_max_members_orga
    BEFORE INSERT ON involve
    FOR EACH ROW
    EXECUTE PROCEDURE pc_check_max_members_orga();


--
-- Name: tg_check_max_participants; Type: TRIGGER; Schema: public; Owner: alexisanomdb
--

CREATE TRIGGER tg_check_max_participants
    BEFORE INSERT ON participate
    FOR EACH ROW
    EXECUTE PROCEDURE pc_check_max_participants();


--
-- Name: tg_check_max_participants_per_team; Type: TRIGGER; Schema: public; Owner: alexisanomdb
--

CREATE TRIGGER tg_check_max_participants_per_team
    BEFORE INSERT ON "join"
    FOR EACH ROW
    EXECUTE PROCEDURE pc_check_max_participants_per_team();


--
-- Name: fk_involve_organization; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY involve
    ADD CONSTRAINT fk_involve_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_involve_user; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY involve
    ADD CONSTRAINT fk_involve_user FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hackathons_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY hackathons
    ADD CONSTRAINT hackathons_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: join_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY "join"
    ADD CONSTRAINT join_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id);


--
-- Name: join_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY "join"
    ADD CONSTRAINT join_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: news_hackathon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY news
    ADD CONSTRAINT news_hackathon_id_fkey FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: organizations_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY organizations
    ADD CONSTRAINT organizations_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: participate_hackathon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY participate
    ADD CONSTRAINT participate_hackathon_id_fkey FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: participate_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY participate
    ADD CONSTRAINT participate_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: projects_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES users(id);


--
-- Name: projects_hackathon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY projects
    ADD CONSTRAINT projects_hackathon_id_fkey FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: vote_project_fk; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY vote
    ADD CONSTRAINT vote_project_fk FOREIGN KEY (project_id) REFERENCES projects(id);


--
-- Name: vote_user_fk; Type: FK CONSTRAINT; Schema: public; Owner: alexisanomdb
--

ALTER TABLE ONLY vote
    ADD CONSTRAINT vote_user_fk FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO alexisanomdb WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--