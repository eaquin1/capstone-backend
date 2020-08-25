--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

CREATE TABLE public.users (
    dexcom_id TEXT  NOT NULL PRIMARY KEY,
    user_refresh_token TEXT NOT NULL
);

CREATE TABLE public.meals (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    dexcom_id TEXT   NOT NULL,
    foods TEXT[]   NOT NULL,
    carb_count integer,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ONLY public.meals 
    ADD CONSTRAINT fk_Meals_dexcom_id FOREIGN KEY(dexcom_id)
REFERENCES public.users(dexcom_id) ON DELETE CASCADE;

