<h1>Current satellites:</h1>
<h1>Handlebars JS Example</h1>
{{#each foo}}
{{this}}
{{/each}}
<table>
    <thead> 
        <th>Id</th> 
        <th>Name</th> 
        <th>Lanuch Vehicle Used</th> 
        <th>Longitude</th> 
    </thead> 
    <tbody> 
        {{#each satellites}} 
        <tr> 
            <td>{{id}}</td> 
            <td>{{name}}</td> 
            <td>{{launch_vehicle}}</td> 
            <td>{{longitude}}</td> 
            <td><button onclick="deleteSatellite({{id}})">Delete</button></td>
            <td><a href="/satellites/{{id}}">Update</a></td>
        </tr> 
        {{/each}} 
    </tbody> 
    <form id="addsatellite" action="/satellites" method="post">
    Name: <input type="text" name="name"><br>
    Lanuch Vehicle: <select name="launch_vehicle"> 
        {{#each launchvehicles}}
        <option value="{{id}}">{{name}}</option>
        {{/each}}
    </select><br>
    <input type="submit" value="Submit">
    </form>
</table> 
