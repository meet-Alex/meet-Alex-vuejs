
  export const getLogin = state => state.userinfo;
  export const getCollections = state => state.collections;
  export const relationList = state => state.collection_relationList;
  export const getActiveCollection = state => state.collection;
  export const emptyCollection = state => {
      return (
      {
        "id": -1,
        "parent_id": null,
        "collection_name": "",
        "collection_description": "",
        "public": "1",
        "receive_notifications": "1",
        "created_by": -1,
        "created_at": "",
        "updated_at": "",
        "term_count": 0,
        "ontologies_count": 0,
        "owner_name": "",
        "bookmarked": true,
        "relations": [],
        "relationList": [],
        "ontologies": [],
        "terms": [],
        "owner": {},
        "links": []
      })
  }