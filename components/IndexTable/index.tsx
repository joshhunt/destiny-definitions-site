import s from "./styles.module.scss";

interface IndexTableProps {
  data: {
    name: string;
    count: number;
    subItems: {
      name: string;
      count: number;
    }[];
  }[];
}

export default function IndexTable({ data }: IndexTableProps) {
  return (
    <div>
      {data.map((topLevel) => {
        return (
          <>
            <a className={s.topItem} href={`#${topLevel.name}`}>
              <div className={s.name}>{topLevel.name}</div>
              <div className={s.count}>{topLevel.count}</div>
            </a>

            {topLevel.subItems.map((subItem) => {
              return (
                <a
                  className={s.subItem}
                  href={`#${topLevel.name}_${subItem.name}`}
                >
                  <div className={s.name}>{subItem.name}</div>
                  <div className={s.count}>{subItem.count}</div>
                </a>
              );
            })}
          </>
        );
      })}
    </div>
  );
}
