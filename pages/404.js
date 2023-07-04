import React, { Component } from "react";
import Router from "next/router";
import Head from "next/head";

export default function Error404() {
  React.useEffect(() => {
    Router.push("/admin/dashboard");
  });

  return (
    <Head>
      <title>Redirecting to Dashboard...</title>
    </Head>
  );
}
