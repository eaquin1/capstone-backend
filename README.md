# Type 1 Diabetes Sugar Tracker

The goal of this website is to allow a user to track the carbs they ate during a meal, along with the fluctations of their blood sugars, tracked with
Dexcom. Dexcom is a continous glucose monitor that attaches to a diabetic's arm, and reads your glucose levels, every 5 minutes. The [Dexcom API](https://developer.dexcom.com) makes the glucose readings, calibration events, data range and user events available to third party apps.

While a Type 1 Diabetic calculates the number of carbs they eat in every meal, so they can properly dose their insulin, a diabetic's blood sugar may still end up going too high or too low. I wanted to allow a user of this app to see carb counts for a meal along with a line graph of their blood sugar fluctuations for that day. I’m using the [Edamam API](https://developer.edamam.com/) to allow the user to find the carb count of the foods they’d like to eat, and to upload the data for each meal (similarly to My Fitness Pal, but with a focus on carbs). I’m displaying the carb counts for a meal along with a line graph of their blood sugar fluctuations for that day. I’m hoping it will give the user visual insight into how their meal affected their glucose readings. I plan to continue by studying machine learning. I’d like to train the AI with the specific foods a user eats, how it affects their blood sugar, and then use that insight to time insulin injections. I think machine learning would be quite effective at helping someone avoid highs and lows.

This is the backend code, with the frontend React app served in the client folder. Only the React frontend code can be found here: [Dexcom_Project](https://github.com/eaquin1/dexcom-project)

I made a live demo version of the app, using mock data from Dexcom, so that the site can be used by someone who doesn't have a Dexcom account
Demo with sandbox data: https://dexcom-tracker.herokuapp.com

![Image of schema](https://github.com/eaquin1/dexcom-project/blob/master/public/img/schema.png)
![Image of components](https://github.com/eaquin1/dexcom-project/blob/master/public/img/App.jpg)
[Dexcom API](https://developer.dexcom.com/)
[Edamam API](https://developer.edamam.com/)

Technologies used:

-   [React](https://reactjs.org/)
-   [Express](https://expressjs.com/)
-   [Passport.js](http://www.passportjs.org)
-   [Redis](https://redis.io/)
-   [Postgres-Node](https://node-postgres.com/)
-   [react-hook-form](https://react-hook-form.com/)
-   [Google Charts](https://developers.google.com/chart/interactive/docs)
-   [Material UI](https://material-ui.com/)
-   [React DatePicker](https://reactdatepicker.com/)

## Deploying this App to Heroku

### Prerequisites

You need to [sign up](https://heroku.com/) for a Heroku account if you don't already have one, and install the [Heroku toolbelt](https://devcenter.heroku.com/articles/heroku-cli). (On a Mac with Homebrew, just run `brew install heroku`).

### Deploy to Heroku

To deploy:

1. Clone this repo.
2. Inside the repo directory, run `heroku create` (requires [Heroku toolbelt](https://devcenter.heroku.com/articles/heroku-cli)).
3. Run `git push heroku master` to simultaneously deploy the frontend + backend to Heroku.

#### Using NPM

Check out the `npm` branch if you're not using Yarn:

`git checkout npm`

And then once on that branch, the deploy command is:

`git push heroku npm:master`
