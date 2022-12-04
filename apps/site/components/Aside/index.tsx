import s from "./styles.module.scss";

export default function Aside({ children }: { children: React.ReactNode }) {
  return (
    <p className={s.root}>
      <em>{children}</em>
    </p>
  );
}
