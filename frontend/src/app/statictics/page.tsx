import Image from "next/image";
import Statictic from "@/image/statictic.jpg";
import styles from "./styles.module.css";

export default function StaticticsPage() {
  return (
    <main>
      <div className={styles.statisticContent}>
        <Image
          src={Statictic}
          alt="Статистика"
        />
        <p className={styles.statisticText}>Вот так вот</p>
      </div>
    </main>
  );
}
