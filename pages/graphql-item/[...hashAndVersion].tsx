import { GetStaticPaths, GetStaticProps } from "next";
import gql from "graphql-tag";
import queryGraphql from "../../lib/graphql/queryGraphql";
import { getHashAndVersion } from "../../lib/pageUtils";
import duration from "../../lib/duration";
import {
  ItemPageQuery,
  ItemPageQueryVariables,
} from "../../lib/graphql/types.generated";
import ItemPage, { ItemPageProps } from "../../components/ItemPage";

interface Params {
  hashAndVersion: string[];
  [k: string]: any;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ItemPageProps, Params> = async ({
  params,
}) => {
  const { hash, version } = await getHashAndVersion(
    params?.hashAndVersion ?? []
  );
  if (!hash || !version) {
    return { notFound: true, revalidate: duration("1 day") };
  }

  const data = await queryGraphql<ItemPageQuery, ItemPageQueryVariables>(
    QUERY,
    { hash, version: version.id }
  );

  return { props: { data } };
};

export default ItemPage;

const QUERY = gql`
  fragment DisplayableItem on DestinyInventoryItemDefinition {
    hash
    displayProperties {
      name
      icon
    }
    itemTypeAndTierDisplayName
  }

  fragment RandomItem on DestinyInventoryItemDefinition {
    ...DisplayableItem
  }

  query ItemPage($version: String, $hash: String) {
    item: DestinyInventoryItemDefinition(version: $version, hash: $hash) {
      ...DisplayableItem

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
                ...RandomItem
              }
            }
          }
        }
      }
    }
  }
`;
