# Wallboard Variants
This directory contains all of the wallboard variants that are used. Each variant is built to serve specific team needs based on the feedback we have been given. Additionally, there are two special wallboard variants given below. The wallboad variants are served by routing.
## Home
This variant is the root of all routing and will be the first page the user sees. It allows the user to access any of the other variants through buttons. When new wallboard variants are added, `Home.js` needs to be updated to reflect the new variant option.

### Adding Wallboards
`Home.js` contains a list of javascript object, `wallboards`, which contains all of the wallboard variants. When adding to `wallboards`, you need to add the following...
  * path: The url path needed to reach the variant. Typically just variant name in lowercase such as `/name/`
  * component: This is the component the variant refers to. Don't forget to import the variant as well.
  * key: A string to identify the variant. Use the name of the wallboard as this will be used for the label of the button in `Home.js`
  
  ## NullWallboard
  When a path cannot be resolved to a wallboard variant, the router will serve the `NullWallboard` component. This wallboard informs the user that the variant they tried to access does not exist and will give a button to redirect to `Home`.
