import { useEffect, useState } from "react";
import "./App.css";
import { Button, EditableText, InputGroup, Toaster } from "@blueprintjs/core";

const AppToaster = Toaster.create({
  position: "top"
})

function App() {
  const [users, setUsers] = useState([]);
  const [newName,setName] = useState("");
  const [newEmail,setEmail] = useState("");
  const [newWebsite,setWebsite] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => setUsers(json));
  }, []);

  function addUser(){
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if(name && email && website){
      fetch("https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          body: JSON.stringify({
            name,email,website
          }),
          headers:{
            "Content-Type": "application/json;charset=UTF-8"
          }
        }
      ).then((response)=>response.json())
      .then(json=>{
        setUsers([...users,json]);
        AppToaster.show({
          message: "user added successfully",
          intent: "success",
          timeout: "3000"
        })
        setEmail("");
        setName("");
        setWebsite("");
      })
    }
  }

  function onChangeHandler(id,key,value){
    setUsers((users)=>{
      return users.map(user=>{
        return user.id === id ? {...user, [key]:value} : user;
      })
    })
  }

  function updateUser(id){
    const user = users.find(user => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            user
          }),
          headers:{
            "Content-Type": "application/json;charset=UTF-8"
          }
        }
      ).then((response)=>response.json())
      .then(json=>{
        AppToaster.show({
          message: "user updated successfully",
          intent: "success",
          timeout: "3000"
        })
        
      })
  }

  function deleteUser(id){
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "DELETE"
        }
      ).then((response)=>response.json())
      .then(json=>{
        setUsers(users=>{
          return users.filter(user=>user.id !== id);
        })
        AppToaster.show({
          message: "user deleted successfully",
          intent: "danger",
          timeout: "3000"
        })
        
      })
  }

  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td><td>{user.name}</td>
              <td><EditableText value={user.email} onChange={value=>onChangeHandler(user.id,"email",value)}/></td>
              <td><EditableText value={user.website} onChange={value=>onChangeHandler(user.id,"website",value)}/></td>
              <td>
                <Button intent="primary" onClick={()=>updateUser(user.id)}>Update</Button>
                &nbsp;
                <Button intent="danger" onClick={()=>deleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup value={newName} onChange={(e)=>setName(e.target.value)} placeholder="enter name..."/>
            </td>
            <td>
              <InputGroup value={newEmail} onChange={(e)=>setEmail(e.target.value)} placeholder="enter email..."/>
            </td>
            <td>
              <InputGroup value={newWebsite} onChange={(e)=>setWebsite(e.target.value)} placeholder="enter website..."/>
            </td>
            <td><Button intent="success" onClick={addUser}>Add</Button></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
