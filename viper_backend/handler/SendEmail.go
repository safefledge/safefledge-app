package handler

import (
	"context"
	"fmt"
	"time"

	"github.com/mailersend/mailersend-go"
	"github.com/spf13/viper"
	"safefledge.com/m/v2/database"
)

func SendEmail(email *database.Email) error {
	viper.SetConfigFile("ENV")
	viper.ReadInConfig()
	viper.AutomaticEnv()
	API_KEY := viper.Get("API_KEY").(string)

	ms := mailersend.NewMailersend(API_KEY)

	ctx := context.Background()
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	// Create a new email

	subject := email.Subject
	text := email.Body
	html := email.Body

	from := mailersend.From{
		Name:  "Safe Fledge",
		Email: "no-reply@safefledge.com",
	}

	recipients := []mailersend.Recipient{
		{
			Email: email.To,
			Name:  email.To,
		},
	}

	tags := []string{"Safe Fledge"}

	message := ms.Email.NewMessage()

	message.SetFrom(from)
	message.SetRecipients(recipients)
	message.SetSubject(subject)
	message.SetText(text)
	message.SetHTML(html)
	message.SetTags(tags)

	res, _ := ms.Email.Send(ctx, message)

	fmt.Printf(res.Header.Get("X-Message-Id"))

	return nil

}
