import React from "react";
import s from "./styles.module.scss";

export default function Table({ children }: { children: React.ReactNode }) {
  return <table className={s.table}>{children}</table>;
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className={s.tableHeader}>
      <tr>{children}</tr>
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr>{children}</tr>;
}

export function SmallCell({ children }: { children: React.ReactNode }) {
  return <td className={s.shrink}>{children}</td>;
}

export function Cell({ children }: { children: React.ReactNode }) {
  return <td>{children}</td>;
}

export function NoWrapCell({ children }: { children: React.ReactNode }) {
  return <td className={s.nowrap}>{children}</td>;
}

export function ProseCell({ children }: { children: React.ReactNode }) {
  return <td className={s.prewrap}>{children}</td>;
}
