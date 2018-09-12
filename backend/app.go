package main

import (
	"net/http"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

// App struct
type App struct {
	Engine *echo.Echo
	API    *API
}

// NewApp init app
func NewApp() *App {
	e := echo.New()
	app := &App{
		Engine: e,
		API:    &API{},
	}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))

	http.Handle("/", e)
	//http.HandleFunc("/", indexHandler)
	//http.HandleFunc("/timeline", timelineHandler)

	//timeline := e.Group("/timeline")
	//timeline.GET("", timelineHandler)

	app.API.Bind(app.Engine.Group("/api/v1"))

	return app
}

// Run apps (in google app engine, do nothing)
func (app *App) Run() {
}
