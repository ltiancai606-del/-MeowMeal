import { createHashRouter } from "react-router";
import { Root } from "./Root";
import { HomeScreen } from "./components/screens/HomeScreen";
import { RecipeScreen } from "./components/screens/RecipeScreen";
import { RecipeDetailScreen } from "./components/screens/RecipeDetailScreen";
import { RecipeCreateScreen } from "./components/screens/RecipeCreateScreen";
import { FridgeScreen } from "./components/screens/FridgeScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";

export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomeScreen },
      { path: "recipe", Component: RecipeScreen },
      { path: "recipe/create", Component: RecipeCreateScreen },
      { path: "recipe/:id", Component: RecipeDetailScreen },
      { path: "fridge", Component: FridgeScreen },
      { path: "profile", Component: ProfileScreen },
    ],
  },
]);