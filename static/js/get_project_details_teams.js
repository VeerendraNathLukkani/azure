function projectTeamsAPI(event)
{
    action_type = this.options[this.selectedIndex].id;

    console.log(action_type)
    <!--window.alert(action_type)-->
    var xhr = new XMLHttpRequest();
var url = "http://"+host_name+":5000/processtemplate?organization="+action_type;
xhr.open("GET", url, true);
xhr.onreadystatechange = function () {
document.getElementById('loader').style.display = 'none';
    if (xhr.readyState === 4 && xhr.status === 200) {
        var data = xhr.responseText;
        console.log(data)
        	var json = JSON.parse(data);
        	console.log(json)
        	json_project = json[1]
        	console.log(json_project)
        	json_project = json[1]['value']
        	console.log(json_project)
 var select = document.getElementById('project_name_teams');
   for (var key in json_project) {
   console.log(json_project[key]['name'])
    if (json_project.hasOwnProperty(key)) {
        select.options[select.options.length] = new Option(json_project[key]['name'], json_project[key]['id']);
        <!--window.alert(json[key]['name'])-->

    }
    }
    }

};

xhr.send();

}