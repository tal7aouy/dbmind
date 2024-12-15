export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface DBSchema {
  tables: Table[];
  relationships: {
    from: string;
    to: string;
    type: "one-to-one" | "one-to-many" | "many-to-many";
  }[];
}
