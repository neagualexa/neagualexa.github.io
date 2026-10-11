// Where the pet dragon's mouth is, in page coordinates (null when it isn't
// around), plus a way to make it chomp. PetDragon writes this every frame so
// other effects, like the hero stardust in MagicField, can be eaten by it.
export const petMouth = { x: null, y: null, chomp: () => {} };
