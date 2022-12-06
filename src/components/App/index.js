import React, { useState, useEffect } from "react";
import InputList from "../InputList";
import ShowList from "../ShowList";
import ClearList from "../ClearList";

/* 1. App will contain components which will allow a person to input items into a list, show the items that are in the list, 
and clear all of the items in a list. 
2. In order for the components to interact with one another, some functionality will need to be hoisted into the App component
 */

const url = process.env.REACT_APP_BACKEND_URL;
function App() {
  const [list, setList] = useState([]);

  // Fetching shopping list data from shopping list API.
  useEffect(() => {
    async function getShoppingList() {
      const response = await fetch("https://backendfirst.onrender.com/items");
      const data = await response.json(response);
      console.log(data);
      setList(data.payload);
    }
    getShoppingList();
  }, []);

  async function addToList(newListItem) {
    //This function changes the state of the list by pushing the text from the input field in to the array.
    const listItemWithoutId = {
      item: newListItem,
      completed: false,
    };

    const response = await fetch("https://backendfirst.onrender.com/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listItem: listItemWithoutId }),
    });

    if (!response.ok) {
      // Shouldn't really use alert, as it blocks, but will do for now.
      return alert("Failed to add item, please try again later.");
    }

    const data = await response.json();
    const listItemWithId = data.payload;

    setList((previous) => [...previous, listItemWithId]);
  }

  async function clearList() {
    await fetch("https://backendfirst.onrender.com/items", {
      method: "DELETE",
    });
    // const clearedList = [];
    // setList(clearedList);
    const response = await fetch("https://backendfirst.onrender.com/items");
    const data = await response.json(response);
    setList(data.payload);
  }

  function tickItem(idOfTickedItem) {
    setList((previous) => {
      return previous.map((item) => {
        return item.id !== idOfTickedItem
          ? item
          : { ...item, completed: !item.completed };
      });
    });
  }

  return (
    <section>
      <InputList addToList={addToList} buttonText={"Add To List"} />
      <ShowList list={list} tickItem={tickItem} />
      <ClearList clearList={clearList} buttonText={"Clear List"} />
    </section>
  );
}

export default App;
