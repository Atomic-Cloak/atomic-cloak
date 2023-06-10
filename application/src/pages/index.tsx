import React, { useContext } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Header from "@/components/Header";
import { Main } from "@/components/Main";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Atomic Cloak - Privacy preserving atomic swaps</title>
        <meta name="description" content="privacy preserving atomic swaps" />
      </Head>
      <Header />
      <main>
        <Main />
      </main>
    </>
  );
};

export default Home;
