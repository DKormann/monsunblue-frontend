
package main

import "net/http"
import "log"

func main(){
	http.Handle("/", http.FileServer(http.Dir("../dist")))

	log.Fatal(http.ListenAndServeTLS(
		":443",
		"/etc/letsencrypt/live/www.monsunblue.de/cert.pem",
		"/etc/letsencrypt/live/www.monsunblue.de/privkey.pem",
		nil))
}
