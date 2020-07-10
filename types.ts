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

export type BasicDefinitionTable = {
  [hash: number]: BareDestinyDefinition | null;
};

interface AllDestinyManifestComponentsTagged {
  DestinyPlaceDefinition: {
    [key: number]: DestinyPlaceDefinition & {
      __type: "DestinyPlaceDefinition";
    };
  };
  DestinyActivityDefinition: {
    [key: number]: DestinyActivityDefinition & {
      __type: "DestinyActivityDefinition";
    };
  };
  DestinyActivityTypeDefinition: {
    [key: number]: DestinyActivityTypeDefinition & {
      __type: "DestinyActivityTypeDefinition";
    };
  };
  DestinyClassDefinition: {
    [key: number]: DestinyClassDefinition & {
      __type: "DestinyClassDefinition";
    };
  };
  DestinyGenderDefinition: {
    [key: number]: DestinyGenderDefinition & {
      __type: "DestinyGenderDefinition";
    };
  };
  DestinyInventoryBucketDefinition: {
    [key: number]: DestinyInventoryBucketDefinition & {
      __type: "DestinyInventoryBucketDefinition";
    };
  };
  DestinyRaceDefinition: {
    [key: number]: DestinyRaceDefinition & { __type: "DestinyRaceDefinition" };
  };
  DestinyTalentGridDefinition: {
    [key: number]: DestinyTalentGridDefinition & {
      __type: "DestinyTalentGridDefinition";
    };
  };
  DestinyUnlockDefinition: {
    [key: number]: DestinyUnlockDefinition & {
      __type: "DestinyUnlockDefinition";
    };
  };
  DestinyMaterialRequirementSetDefinition: {
    [key: number]: DestinyMaterialRequirementSetDefinition & {
      __type: "DestinyMaterialRequirementSetDefinition";
    };
  };
  DestinySandboxPerkDefinition: {
    [key: number]: DestinySandboxPerkDefinition & {
      __type: "DestinySandboxPerkDefinition";
    };
  };
  DestinyStatGroupDefinition: {
    [key: number]: DestinyStatGroupDefinition & {
      __type: "DestinyStatGroupDefinition";
    };
  };
  DestinyProgressionMappingDefinition: {
    [key: number]: DestinyProgressionMappingDefinition & {
      __type: "DestinyProgressionMappingDefinition";
    };
  };
  DestinyFactionDefinition: {
    [key: number]: DestinyFactionDefinition & {
      __type: "DestinyFactionDefinition";
    };
  };
  DestinyVendorGroupDefinition: {
    [key: number]: DestinyVendorGroupDefinition & {
      __type: "DestinyVendorGroupDefinition";
    };
  };
  DestinyRewardSourceDefinition: {
    [key: number]: DestinyRewardSourceDefinition & {
      __type: "DestinyRewardSourceDefinition";
    };
  };
  DestinyUnlockValueDefinition: {
    [key: number]: DestinyUnlockValueDefinition & {
      __type: "DestinyUnlockValueDefinition";
    };
  };
  DestinyItemCategoryDefinition: {
    [key: number]: DestinyItemCategoryDefinition & {
      __type: "DestinyItemCategoryDefinition";
    };
  };
  DestinyDamageTypeDefinition: {
    [key: number]: DestinyDamageTypeDefinition & {
      __type: "DestinyDamageTypeDefinition";
    };
  };
  DestinyActivityModeDefinition: {
    [key: number]: DestinyActivityModeDefinition & {
      __type: "DestinyActivityModeDefinition";
    };
  };
  DestinyActivityGraphDefinition: {
    [key: number]: DestinyActivityGraphDefinition & {
      __type: "DestinyActivityGraphDefinition";
    };
  };
  DestinyCollectibleDefinition: {
    [key: number]: DestinyCollectibleDefinition & {
      __type: "DestinyCollectibleDefinition";
    };
  };
  DestinyStatDefinition: {
    [key: number]: DestinyStatDefinition & { __type: "DestinyStatDefinition" };
  };
  DestinyItemTierTypeDefinition: {
    [key: number]: DestinyItemTierTypeDefinition & {
      __type: "DestinyItemTierTypeDefinition";
    };
  };
  DestinyMetricDefinition: {
    [key: number]: DestinyMetricDefinition & {
      __type: "DestinyMetricDefinition";
    };
  };
  DestinyPlugSetDefinition: {
    [key: number]: DestinyPlugSetDefinition & {
      __type: "DestinyPlugSetDefinition";
    };
  };
  DestinyPowerCapDefinition: {
    [key: number]: DestinyPowerCapDefinition & {
      __type: "DestinyPowerCapDefinition";
    };
  };
  DestinyPresentationNodeDefinition: {
    [key: number]: DestinyPresentationNodeDefinition & {
      __type: "DestinyPresentationNodeDefinition";
    };
  };
  DestinyRecordDefinition: {
    [key: number]: DestinyRecordDefinition & {
      __type: "DestinyRecordDefinition";
    };
  };
  DestinyDestinationDefinition: {
    [key: number]: DestinyDestinationDefinition & {
      __type: "DestinyDestinationDefinition";
    };
  };
  DestinyEquipmentSlotDefinition: {
    [key: number]: DestinyEquipmentSlotDefinition & {
      __type: "DestinyEquipmentSlotDefinition";
    };
  };
  DestinyInventoryItemDefinition: {
    [key: number]: DestinyInventoryItemDefinition & {
      __type: "DestinyInventoryItemDefinition";
    };
  };
  DestinyLocationDefinition: {
    [key: number]: DestinyLocationDefinition & {
      __type: "DestinyLocationDefinition";
    };
  };
  DestinyLoreDefinition: {
    [key: number]: DestinyLoreDefinition & { __type: "DestinyLoreDefinition" };
  };
  DestinyObjectiveDefinition: {
    [key: number]: DestinyObjectiveDefinition & {
      __type: "DestinyObjectiveDefinition";
    };
  };
  DestinyProgressionDefinition: {
    [key: number]: DestinyProgressionDefinition & {
      __type: "DestinyProgressionDefinition";
    };
  };
  DestinyProgressionLevelRequirementDefinition: {
    [key: number]: DestinyProgressionLevelRequirementDefinition & {
      __type: "DestinyProgressionLevelRequirementDefinition";
    };
  };
  DestinySeasonDefinition: {
    [key: number]: DestinySeasonDefinition & {
      __type: "DestinySeasonDefinition";
    };
  };
  DestinySeasonPassDefinition: {
    [key: number]: DestinySeasonPassDefinition & {
      __type: "DestinySeasonPassDefinition";
    };
  };
  DestinySocketCategoryDefinition: {
    [key: number]: DestinySocketCategoryDefinition & {
      __type: "DestinySocketCategoryDefinition";
    };
  };
  DestinySocketTypeDefinition: {
    [key: number]: DestinySocketTypeDefinition & {
      __type: "DestinySocketTypeDefinition";
    };
  };
  DestinyTraitDefinition: {
    [key: number]: DestinyTraitDefinition & {
      __type: "DestinyTraitDefinition";
    };
  };
  DestinyTraitCategoryDefinition: {
    [key: number]: DestinyTraitCategoryDefinition & {
      __type: "DestinyTraitCategoryDefinition";
    };
  };
  DestinyVendorDefinition: {
    [key: number]: DestinyVendorDefinition & {
      __type: "DestinyVendorDefinition";
    };
  };
  DestinyMilestoneDefinition: {
    [key: number]: DestinyMilestoneDefinition & {
      __type: "DestinyMilestoneDefinition";
    };
  };
  DestinyActivityModifierDefinition: {
    [key: number]: DestinyActivityModifierDefinition & {
      __type: "DestinyActivityModifierDefinition";
    };
  };
  DestinyReportReasonCategoryDefinition: {
    [key: number]: DestinyReportReasonCategoryDefinition & {
      __type: "DestinyReportReasonCategoryDefinition";
    };
  };
  DestinyArtifactDefinition: {
    [key: number]: DestinyArtifactDefinition & {
      __type: "DestinyArtifactDefinition";
    };
  };
  DestinyBreakerTypeDefinition: {
    [key: number]: DestinyBreakerTypeDefinition & {
      __type: "DestinyBreakerTypeDefinition";
    };
  };
  DestinyChecklistDefinition: {
    [key: number]: DestinyChecklistDefinition & {
      __type: "DestinyChecklistDefinition";
    };
  };
  DestinyEnergyTypeDefinition: {
    [key: number]: DestinyEnergyTypeDefinition & {
      __type: "DestinyEnergyTypeDefinition";
    };
  };
}
