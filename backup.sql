--
-- PostgreSQL database dump
--

\restrict ZlW4Sw75wlEMvUMxyUxnK4JrlBOiKAzI1AOOgagMFGXkVYHb5aMrFZDvCkfioUr

-- Dumped from database version 17.8 (Postgres.app)
-- Dumped by pg_dump version 17.8 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: lucas
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO lucas;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: lucas
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Stock; Type: TABLE; Schema: public; Owner: lucas
--

CREATE TABLE public."Stock" (
    id integer NOT NULL,
    ticker text NOT NULL,
    name text,
    quantity integer DEFAULT 0 NOT NULL,
    "buyPrice" double precision,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Stock" OWNER TO lucas;

--
-- Name: Stock_id_seq; Type: SEQUENCE; Schema: public; Owner: lucas
--

CREATE SEQUENCE public."Stock_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Stock_id_seq" OWNER TO lucas;

--
-- Name: Stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lucas
--

ALTER SEQUENCE public."Stock_id_seq" OWNED BY public."Stock".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: lucas
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."User" OWNER TO lucas;

--
-- Name: Stock id; Type: DEFAULT; Schema: public; Owner: lucas
--

ALTER TABLE ONLY public."Stock" ALTER COLUMN id SET DEFAULT nextval('public."Stock_id_seq"'::regclass);


--
-- Data for Name: Stock; Type: TABLE DATA; Schema: public; Owner: lucas
--

COPY public."Stock" (id, ticker, name, quantity, "buyPrice", "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: lucas
--

COPY public."User" (id, email, password, "createdAt", "updatedAt", name) FROM stdin;
\.


--
-- Name: Stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lucas
--

SELECT pg_catalog.setval('public."Stock_id_seq"', 1, false);


--
-- Name: Stock Stock_pkey; Type: CONSTRAINT; Schema: public; Owner: lucas
--

ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: lucas
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Stock_userId_ticker_key; Type: INDEX; Schema: public; Owner: lucas
--

CREATE UNIQUE INDEX "Stock_userId_ticker_key" ON public."Stock" USING btree ("userId", ticker);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: lucas
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_id_key; Type: INDEX; Schema: public; Owner: lucas
--

CREATE UNIQUE INDEX "User_id_key" ON public."User" USING btree (id);


--
-- Name: Stock Stock_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lucas
--

ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: lucas
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict ZlW4Sw75wlEMvUMxyUxnK4JrlBOiKAzI1AOOgagMFGXkVYHb5aMrFZDvCkfioUr

