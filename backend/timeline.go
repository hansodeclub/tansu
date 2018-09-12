package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

func parseDate(dateStr string) *time.Time {
	format := "20060102"
	local, _ := time.LoadLocation("Asia/Tokyo") // TODO: parameterize
	t, err := time.ParseInLocation(format, dateStr, local)
	if err == nil {
		return &t
	}

	return nil
}

// API struct
type API struct{}

// Bind binds handlers
func (api *API) Bind(group *echo.Group) {
	group.GET("/timeline", api.TimelineHandler)
	group.GET("/timeline/:date", api.TimelineHandler)
	group.GET("/timeline/*", api.TimelineHandler)

	group.GET("/user/:user_id", api.TimelineHandler)
	group.GET("/user/:user_id/:date", api.TimelineHandler)
}

// TimelineHandler handles timeline retrieve api call
func (api *API) TimelineHandler(e echo.Context) error {
	stdCtx := appengine.NewContext(e.Request())

	var q *datastore.Query
	q = datastore.NewQuery("LocalTimeline").Order("-created_at")

	// if cursor is specified
	if cursorStr := e.QueryParam("cursor"); cursorStr != "" {
		cursor, err := datastore.DecodeCursor(cursorStr)
		if err == nil {
			q = q.Start(cursor)
		}
	}

	var size int
	if sizeStr := e.QueryParam("size"); sizeStr != "" {
		size, _ = strconv.Atoi(sizeStr)
	} else {
		size = 20
	}

	// filter by user name (query param)
	if userID := e.QueryParam("user"); userID != "" {
		q = q.Filter("account.acct =", userID)
	}

	// filter by user name (path param)
	if userID := e.Param("user_id"); userID != "" {
		q = q.Filter("account.acct =", userID)
	}

	// filter date
	startAt := parseDate(e.Param("date"))
	if startAt != nil {
		endAt := startAt.AddDate(0, 0, 1)
		q = q.Filter("created_at >=", *startAt).Filter("created_at <", endAt)
	}
	result := runQuery(stdCtx, q, size)

	return e.JSON(http.StatusOK, result)
}
