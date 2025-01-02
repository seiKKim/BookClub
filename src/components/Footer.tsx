import Image from 'next/image';
import styles from './Footer.module.css'; // CSS 모듈

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.footLogo}>
        ㈜글로브포인트
      </h2>
      <p className={styles.address}>
        경기도 고양시 덕양구 삼원로 83, 광양프런티어밸리 6차 1111호 (10550)
      </p>
      <ul className={styles.infoList}>
        <li>
          <Image src="/ic-tell.png" alt="전화 아이콘" width={20} height={20} />
          <a href="tel:0319110601">031-911-0601</a>
        </li>
        <li>
          <Image src="/ic-fax.png" alt="팩스 아이콘" width={20} height={20} />
          <a href="tel:0319220602">031-922-0602</a>
        </li>
        <li>
          <Image src="/ic-mail.png" alt="메일 아이콘" width={20} height={20} />
          <a href="mailto:gpsales@globepoint.co.kr">gpsales@globepoint.co.kr</a>
        </li>
      </ul>
      <p className={styles.copy}>
        Copyrights ⓒ 2019 Globepoint Inc. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
