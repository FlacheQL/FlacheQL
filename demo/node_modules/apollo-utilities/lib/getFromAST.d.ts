import { DocumentNode, OperationDefinitionNode, FragmentDefinitionNode } from 'graphql';
import { JsonValue } from './storeUtils';
export declare function getMutationDefinition(doc: DocumentNode): OperationDefinitionNode;
export declare function checkDocument(doc: DocumentNode): void;
export declare function getOperationDefinition(doc: DocumentNode): OperationDefinitionNode | undefined;
export declare function getOperationDefinitionOrDie(document: DocumentNode): OperationDefinitionNode;
export declare function getOperationName(doc: DocumentNode): string | null;
export declare function getFragmentDefinitions(doc: DocumentNode): FragmentDefinitionNode[];
export declare function getQueryDefinition(doc: DocumentNode): OperationDefinitionNode;
export declare function getFragmentDefinition(doc: DocumentNode): FragmentDefinitionNode;
/**
 * Returns the first operation definition found in this document.
 * If no operation definition is found, the first fragment definition will be returned.
 * If no definitions are found, an error will be thrown.
 */
export declare function getMainDefinition(queryDoc: DocumentNode): OperationDefinitionNode | FragmentDefinitionNode;
/**
 * This is an interface that describes a map from fragment names to fragment definitions.
 */
export interface FragmentMap {
    [fragmentName: string]: FragmentDefinitionNode;
}
export declare function createFragmentMap(fragments?: FragmentDefinitionNode[]): FragmentMap;
export declare function getDefaultValues(definition: OperationDefinitionNode | undefined): {
    [key: string]: JsonValue;
};
/**
 * Returns the names of all variables declared by the operation.
 */
export declare function variablesInOperation(operation: OperationDefinitionNode): Set<string>;
