"use client"
import React, { useState, useEffect } from "react";

import styles from "./page.module.css";

import Link from 'next/link'
import RootLayout from "./layout"


export default function Home() {

  return (
    <main className={styles.main}>
      <Link href="/meteor">Meteor</Link>
    </main>
  );
}
