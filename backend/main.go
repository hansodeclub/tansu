package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
	_ "google.golang.org/appengine/remote_api"
)

func init() {
	app := NewApp()
	app.Run()
}

func main() {
	appengine.Main()
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	ctx := appengine.NewContext(r)
	//var timelines []TimelineEntity //[]interface{}
	var props []datastore.PropertyList

	q := datastore.NewQuery("LocalTimeline").Limit(20)
	if _, err := q.GetAll(ctx, &props); err != nil {
		log.Errorf(ctx, "Getting posts: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintln(w, "Couldn't get latest posts. Refresh?")
		return
	}

	entity, _ := getEntities(&props)
	s, _ := json.Marshal(entity)
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintln(w, string(s))
}
