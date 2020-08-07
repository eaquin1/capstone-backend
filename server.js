/** Start server for Dexcom-CarbCount */

const app = require("./app")
let PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});