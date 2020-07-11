import {
  AllDestinyManifestComponents,
  DestinyUnlockDefinition,
  DestinyDisplayPropertiesDefinition,
  DestinyPlaceDefinition,
  DestinyActivityDefinition,
  DestinyActivityTypeDefinition,
  DestinyClassDefinition,
  DestinyGenderDefinition,
  DestinyInventoryBucketDefinition,
  DestinyRaceDefinition,
  DestinyTalentGridDefinition,
  DestinyMaterialRequirementSetDefinition,
  DestinySandboxPerkDefinition,
  DestinyStatGroupDefinition,
  DestinyProgressionMappingDefinition,
  DestinyFactionDefinition,
  DestinyVendorGroupDefinition,
  DestinyRewardSourceDefinition,
  DestinyUnlockValueDefinition,
  DestinyItemCategoryDefinition,
  DestinyDamageTypeDefinition,
  DestinyActivityModeDefinition,
  DestinyActivityGraphDefinition,
  DestinyCollectibleDefinition,
  DestinyStatDefinition,
  DestinyItemTierTypeDefinition,
  DestinyMetricDefinition,
  DestinyPlugSetDefinition,
  DestinyPowerCapDefinition,
  DestinyPresentationNodeDefinition,
  DestinyRecordDefinition,
  DestinyDestinationDefinition,
  DestinyEquipmentSlotDefinition,
  DestinyInventoryItemDefinition,
  DestinyLocationDefinition,
  DestinyLoreDefinition,
  DestinyObjectiveDefinition,
  DestinyProgressionDefinition,
  DestinyProgressionLevelRequirementDefinition,
  DestinySeasonDefinition,
  DestinySeasonPassDefinition,
  DestinySocketCategoryDefinition,
  DestinySocketTypeDefinition,
  DestinyTraitDefinition,
  DestinyTraitCategoryDefinition,
  DestinyVendorDefinition,
  DestinyMilestoneDefinition,
  DestinyActivityModifierDefinition,
  DestinyReportReasonCategoryDefinition,
  DestinyArtifactDefinition,
  DestinyBreakerTypeDefinition,
  DestinyChecklistDefinition,
  DestinyEnergyTypeDefinition,
} from "bungie-api-ts/destiny2";

export interface ManifestVersion {
  version: string;
  s3Key: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DefinitionDiff {
  removed: number[];
  added: number[];
  unclassified: number[];
  reclassified: number[];
}

export type AllDefinitionDiffs = {
  [name: string]: DefinitionDiff;
};

export type DiffsByVersion = { [version: string]: AllDefinitionDiffs | null };

export type AnyDefinitionTable = AllDestinyManifestComponentsTagged[keyof AllDestinyManifestComponentsTagged];
export type AnyDefinition = AnyDefinitionTable[keyof AnyDefinitionTable];

export interface BareDestinyDefinition {
  hash: DestinyUnlockDefinition["hash"];
  displayProperties?: DestinyDisplayPropertiesDefinition;
}

export enum ItemCategory {
  Weapon = "Weapon",
  Armor = "Armor",
  Ghost = "Ghost",
  Emote = "Emote",
  Emblem = "Emblem",
  Vehicle = "Vehicle",
  Ornament = "Ornament",
  Other = "Other",
}

export const ItemCategoryValues: string[] = Object.values(ItemCategory);

export type BasicDefinitionTable = {
  [hash: number]: BareDestinyDefinition | null;
};

export interface AllDestinyManifestComponentsTagged {
  DestinyPlaceDefinition: {
    [hash: string]: DestinyPlaceDefinition & {
      __type: "DestinyPlaceDefinition";
    };
  };
  DestinyActivityDefinition: {
    [hash: string]: DestinyActivityDefinition & {
      __type: "DestinyActivityDefinition";
    };
  };
  DestinyActivityTypeDefinition: {
    [hash: string]: DestinyActivityTypeDefinition & {
      __type: "DestinyActivityTypeDefinition";
    };
  };
  DestinyClassDefinition: {
    [hash: string]: DestinyClassDefinition & {
      __type: "DestinyClassDefinition";
    };
  };
  DestinyGenderDefinition: {
    [hash: string]: DestinyGenderDefinition & {
      __type: "DestinyGenderDefinition";
    };
  };
  DestinyInventoryBucketDefinition: {
    [hash: string]: DestinyInventoryBucketDefinition & {
      __type: "DestinyInventoryBucketDefinition";
    };
  };
  DestinyRaceDefinition: {
    [hash: string]: DestinyRaceDefinition & { __type: "DestinyRaceDefinition" };
  };
  DestinyTalentGridDefinition: {
    [hash: string]: DestinyTalentGridDefinition & {
      __type: "DestinyTalentGridDefinition";
    };
  };
  DestinyUnlockDefinition: {
    [hash: string]: DestinyUnlockDefinition & {
      __type: "DestinyUnlockDefinition";
    };
  };
  DestinyMaterialRequirementSetDefinition: {
    [hash: string]: DestinyMaterialRequirementSetDefinition & {
      __type: "DestinyMaterialRequirementSetDefinition";
    };
  };
  DestinySandboxPerkDefinition: {
    [hash: string]: DestinySandboxPerkDefinition & {
      __type: "DestinySandboxPerkDefinition";
    };
  };
  DestinyStatGroupDefinition: {
    [hash: string]: DestinyStatGroupDefinition & {
      __type: "DestinyStatGroupDefinition";
    };
  };
  DestinyProgressionMappingDefinition: {
    [hash: string]: DestinyProgressionMappingDefinition & {
      __type: "DestinyProgressionMappingDefinition";
    };
  };
  DestinyFactionDefinition: {
    [hash: string]: DestinyFactionDefinition & {
      __type: "DestinyFactionDefinition";
    };
  };
  DestinyVendorGroupDefinition: {
    [hash: string]: DestinyVendorGroupDefinition & {
      __type: "DestinyVendorGroupDefinition";
    };
  };
  DestinyRewardSourceDefinition: {
    [hash: string]: DestinyRewardSourceDefinition & {
      __type: "DestinyRewardSourceDefinition";
    };
  };
  DestinyUnlockValueDefinition: {
    [hash: string]: DestinyUnlockValueDefinition & {
      __type: "DestinyUnlockValueDefinition";
    };
  };
  DestinyItemCategoryDefinition: {
    [hash: string]: DestinyItemCategoryDefinition & {
      __type: "DestinyItemCategoryDefinition";
    };
  };
  DestinyDamageTypeDefinition: {
    [hash: string]: DestinyDamageTypeDefinition & {
      __type: "DestinyDamageTypeDefinition";
    };
  };
  DestinyActivityModeDefinition: {
    [hash: string]: DestinyActivityModeDefinition & {
      __type: "DestinyActivityModeDefinition";
    };
  };
  DestinyActivityGraphDefinition: {
    [hash: string]: DestinyActivityGraphDefinition & {
      __type: "DestinyActivityGraphDefinition";
    };
  };
  DestinyCollectibleDefinition: {
    [hash: string]: DestinyCollectibleDefinition & {
      __type: "DestinyCollectibleDefinition";
    };
  };
  DestinyStatDefinition: {
    [hash: string]: DestinyStatDefinition & { __type: "DestinyStatDefinition" };
  };
  DestinyItemTierTypeDefinition: {
    [hash: string]: DestinyItemTierTypeDefinition & {
      __type: "DestinyItemTierTypeDefinition";
    };
  };
  DestinyMetricDefinition: {
    [hash: string]: DestinyMetricDefinition & {
      __type: "DestinyMetricDefinition";
    };
  };
  DestinyPlugSetDefinition: {
    [hash: string]: DestinyPlugSetDefinition & {
      __type: "DestinyPlugSetDefinition";
    };
  };
  DestinyPowerCapDefinition: {
    [hash: string]: DestinyPowerCapDefinition & {
      __type: "DestinyPowerCapDefinition";
    };
  };
  DestinyPresentationNodeDefinition: {
    [hash: string]: DestinyPresentationNodeDefinition & {
      __type: "DestinyPresentationNodeDefinition";
    };
  };
  DestinyRecordDefinition: {
    [hash: string]: DestinyRecordDefinition & {
      __type: "DestinyRecordDefinition";
    };
  };
  DestinyDestinationDefinition: {
    [hash: string]: DestinyDestinationDefinition & {
      __type: "DestinyDestinationDefinition";
    };
  };
  DestinyEquipmentSlotDefinition: {
    [hash: string]: DestinyEquipmentSlotDefinition & {
      __type: "DestinyEquipmentSlotDefinition";
    };
  };
  DestinyInventoryItemDefinition: {
    [hash: string]: DestinyInventoryItemDefinition & {
      __type: "DestinyInventoryItemDefinition";
    };
  };
  DestinyLocationDefinition: {
    [hash: string]: DestinyLocationDefinition & {
      __type: "DestinyLocationDefinition";
    };
  };
  DestinyLoreDefinition: {
    [hash: string]: DestinyLoreDefinition & { __type: "DestinyLoreDefinition" };
  };
  DestinyObjectiveDefinition: {
    [hash: string]: DestinyObjectiveDefinition & {
      __type: "DestinyObjectiveDefinition";
    };
  };
  DestinyProgressionDefinition: {
    [hash: string]: DestinyProgressionDefinition & {
      __type: "DestinyProgressionDefinition";
    };
  };
  DestinyProgressionLevelRequirementDefinition: {
    [hash: string]: DestinyProgressionLevelRequirementDefinition & {
      __type: "DestinyProgressionLevelRequirementDefinition";
    };
  };
  DestinySeasonDefinition: {
    [hash: string]: DestinySeasonDefinition & {
      __type: "DestinySeasonDefinition";
    };
  };
  DestinySeasonPassDefinition: {
    [hash: string]: DestinySeasonPassDefinition & {
      __type: "DestinySeasonPassDefinition";
    };
  };
  DestinySocketCategoryDefinition: {
    [hash: string]: DestinySocketCategoryDefinition & {
      __type: "DestinySocketCategoryDefinition";
    };
  };
  DestinySocketTypeDefinition: {
    [hash: string]: DestinySocketTypeDefinition & {
      __type: "DestinySocketTypeDefinition";
    };
  };
  DestinyTraitDefinition: {
    [hash: string]: DestinyTraitDefinition & {
      __type: "DestinyTraitDefinition";
    };
  };
  DestinyTraitCategoryDefinition: {
    [hash: string]: DestinyTraitCategoryDefinition & {
      __type: "DestinyTraitCategoryDefinition";
    };
  };
  DestinyVendorDefinition: {
    [hash: string]: DestinyVendorDefinition & {
      __type: "DestinyVendorDefinition";
    };
  };
  DestinyMilestoneDefinition: {
    [hash: string]: DestinyMilestoneDefinition & {
      __type: "DestinyMilestoneDefinition";
    };
  };
  DestinyActivityModifierDefinition: {
    [hash: string]: DestinyActivityModifierDefinition & {
      __type: "DestinyActivityModifierDefinition";
    };
  };
  DestinyReportReasonCategoryDefinition: {
    [hash: string]: DestinyReportReasonCategoryDefinition & {
      __type: "DestinyReportReasonCategoryDefinition";
    };
  };
  DestinyArtifactDefinition: {
    [hash: string]: DestinyArtifactDefinition & {
      __type: "DestinyArtifactDefinition";
    };
  };
  DestinyBreakerTypeDefinition: {
    [hash: string]: DestinyBreakerTypeDefinition & {
      __type: "DestinyBreakerTypeDefinition";
    };
  };
  DestinyChecklistDefinition: {
    [hash: string]: DestinyChecklistDefinition & {
      __type: "DestinyChecklistDefinition";
    };
  };
  DestinyEnergyTypeDefinition: {
    [hash: string]: DestinyEnergyTypeDefinition & {
      __type: "DestinyEnergyTypeDefinition";
    };
  };
}
