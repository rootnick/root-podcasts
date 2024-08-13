"use client";

import {useContext} from "react";
import Link from "next/link";
import {MAIN_LINK, STATICTICS_LINK} from "@/constants";
import {AuthContext} from "@/context";
import styles from "./styles.module.css";

export const Header = () => {
  const {user, toggleUser} = useContext(AuthContext);

  const handleClick = () => {
    toggleUser(user);
  };

  return (
    <div className={styles.header}>
      <div className={styles.header__content}>
        <Link href={MAIN_LINK}>
          <p className={styles.logo}>Root podcasts</p>
        </Link>

        <div className={styles.header__links}>
          {user && (
            <Link href={STATICTICS_LINK}>
              Статистика
            </Link>
          )}
        </div>

        <button className={styles.button} onClick={handleClick}>
          {user ? "Выйти" : "Войти"}
        </button>
      </div>
    </div>
  );
};
