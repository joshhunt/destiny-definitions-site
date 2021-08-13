import { GetStaticPaths, GetStaticProps } from "next";
import gql from "graphql-tag";
import React from "react";
import queryGraphql from "../../lib/graphql/queryGraphql";

interface Params {
  hash: string;
  [k: string]: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

interface Props {
  data: any;
}

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const { params } = context;
  const { hash } = params ?? {};
  const version = "339ab5ed-b919-4d17-9328-cc340f8c2b61";

  const query = gql`
    query Query($version: String, $hash: String) {
      item: DestinyInventoryItemDefinition(version: $version, hash: $hash) {
        hash
        displayProperties {
          name
          icon
        }

        collectible {
          sourceString
        }

        sockets {
          socketEntries {
            singleInitialItem {
              displayProperties {
                name
                icon
              }
            }

            randomizedPlugSet {
              reusablePlugItems {
                plugItem {
                  displayProperties {
                    name
                    icon
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await queryGraphql(query, { hash, version });

  return { props: { data } };
};

const ItemDefinitionPageWrapper: React.FC<Props> = (props) => {
  return (
    <div>
      <h1>graphql item page</h1>
      <h2>{props.data.item.displayProperties.name}</h2>
    </div>
  );
};

export default ItemDefinitionPageWrapper;
