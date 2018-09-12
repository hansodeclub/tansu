package main

import (
	"context"

	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
)

type (
	QueryResult struct {
		Result []map[string]interface{} `json:"result"`
		Cursor *string                  `json:"cursor"`
	}
)

func getEntity(list *datastore.PropertyList) (map[string]interface{}, error) {
	res := map[string]interface{}{}
	for _, v := range *list {
		if v.Multiple {
			switch t := res[v.Name].(type) {
			case nil:
				res[v.Name] = []interface{}{v.Value}
			case []interface{}:
				res[v.Name] = append(t, v.Value)
			}
			continue
		}
		res[v.Name] = v.Value
	}

	return res, nil
}

func getEntities(list *[]datastore.PropertyList) ([]map[string]interface{}, error) {
	res := make([]map[string]interface{}, len(*list))
	for i, v := range *list {
		res[i], _ = getEntity(&v)
	}

	return res, nil
}

func runQuery(ctx context.Context, query *datastore.Query, pageSize int) *QueryResult {
	var results []map[string]interface{}
	results = make([]map[string]interface{}, 0)
	t := query.Run(ctx)
	for i := 0; i < pageSize; i++ {
		var result datastore.PropertyList
		_, err := t.Next(&result)
		if err == datastore.Done {
			return &QueryResult{
				Result: results,
				Cursor: nil,
			}
		}
		if err != nil {
			log.Errorf(ctx, "%v", err)
			break
		}

		entity, _ := getEntity(&result)
		results = append(results, entity)
	}

	if cursor, err := t.Cursor(); err == nil {
		cs := cursor.String()
		return &QueryResult{
			Result: results,
			Cursor: &cs, //cursor.String(),
		}
	}

	log.Errorf(ctx, "error2")
	return nil
}
