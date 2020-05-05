<!--var host_name = "52.170.190.73"-->
var host_name = "localhost"
document.getElementById('id_policy').style.display = 'none';
document.getElementById('loader').style.display = 'none';



function runCMD(){
document.getElementById('loader').style.display = 'block';
var xhr = new XMLHttpRequest();
var url = "http://"+host_name+":5000/cmd";
xhr.open("GET", url, true);
xhr.onreadystatechange = function () {
document.getElementById('loader').style.display = 'none';
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
       window.alert("Process Done");
;
    }
    <!--else{-->
    <!--window.alert("Process Done");-->
    <!--}-->

};

xhr.send();

}

<!--POLICY OR CLI RUN -->

function policyOrCLIRunCMD(){


document.getElementById('loader').style.display = 'block';
var xhr = new XMLHttpRequest();

var url = "http://"+host_name+":5000/policyorclirun";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
document.getElementById('loader').style.display = 'none';
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
       window.alert("Process Done");

    }

};
var data = {};
	var action_type_ = document.getElementById("action_type");
	var action_type = action_type_.options[action_type_.selectedIndex].text;
    var policy_project_name = document.getElementById("policy_project_name").value;

if(action_type == "Create"){
	var minimum_approver_count = document.getElementById("minimum_approver_count").value;
	var branch_name_policy_ = document.getElementById("branch_name_policy");
	var branch_name_policy = branch_name_policy_.options[branch_name_policy_.selectedIndex].text;
	var policy_repository_id = document.getElementById("policy_repository_id").value;

var data = JSON.stringify({"branch_name": branch_name_policy, "policy_project_name": policy_project_name,
 "policy_repository_id": policy_repository_id, "minimum_approver_count": minimum_approver_count, "action_type":action_type})
}


if(action_type == "Update"){
	var minimum_approver_count = document.getElementById("minimum_approver_count").value;
	var branch_name_policy_ = document.getElementById("branch_name_policy");
	var branch_name_policy = branch_name_policy_.options[branch_name_policy_.selectedIndex].text;
	var id = document.getElementById("id").value;

var data = JSON.stringify({"branch_name": branch_name_policy, "policy_project_name": policy_project_name,
 "id": id, "minimum_approver_count": minimum_approver_count, "action_type":action_type})

}

if(action_type == "Delete"){
	var id = document.getElementById("id").value;


var data = JSON.stringify({"policy_project_name": policy_project_name,
 "id": id, "action_type":action_type})

}

xhr.send(data);

}


<!--POLICY OR CLI RUN -->

function teamsCLIRunCMD(){


document.getElementById('loader').style.display = 'block';
var xhr = new XMLHttpRequest();

var url = "http://"+host_name+":5000/teams";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
document.getElementById('loader').style.display = 'none';
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
//        console.log(json)
        if(json.hasOwnProperty("message")){
       if(json['message'] == 'help'){
       window.alert(json['typeKey']);
       }
       else{
       window.alert(json['message']);
       }
        }
        else{
       window.alert("Successfully Created...");
}
    }

};
var data = {};
	var team_name = document.getElementById("team_name").value;
    var team_description = document.getElementById("team_description").value;
	var o_name_teams = document.getElementById("organization_name_teams");
	var organization_name_teams = o_name_teams.options[o_name_teams.selectedIndex].id;
	var p_name_teams = document.getElementById("project_name_teams");
	var project_name_teams = p_name_teams.options[p_name_teams.selectedIndex].value;






var data = JSON.stringify({'request_data':{"name": team_name, "description": team_description},
 "organization":organization_name_teams, "project_id": project_name_teams})



xhr.send(data);

}


function logData(){
document.getElementById('loader').style.display = 'block';
var xhr = new XMLHttpRequest();
var url = "http://"+host_name+":5000/log";
xhr.open("GET", url, true);
xhr.onreadystatechange = function () {
document.getElementById('loader').style.display = 'none';
    if (xhr.readyState === 4 && xhr.status === 200) {

     window.open("http://"+host_name+":5000/log");
    }

};

xhr.send();

}

function saveInputs() {
document.getElementById('loader').style.display = 'block';

	var project_name = document.getElementById("project_name").value;
	var project_description = document.getElementById("project_description").value;

	var v_control = document.getElementById("version_control");
	var version_control = v_control.options[v_control.selectedIndex].text;
	var visibility_1 = document.getElementById("visibility");
	var visibility = visibility_1.options[visibility_1.selectedIndex].text;
	var p_template = document.getElementById("process_template");
	var process_template = p_template.options[p_template.selectedIndex].text;
	if(process_template == "SAFE Agile"){
	process_template = "SAFE Agile Process"
	}
	console.log(process_template)
	var o_name = document.getElementById("organization_name");
	var organization_name = o_name.options[o_name.selectedIndex].text;

	var pipeline_name = document.getElementById("pipeline_name").value;
	var pipeline_description = document.getElementById("pipeline_description").value;

	var repository_name = document.getElementById("repository_name").value;
	<!--var repository_name = r_name.options[r_name.selectedIndex].text;-->
	var b_name = document.getElementById("branch_name");
	var branch_name = b_name.options[b_name.selectedIndex].text;
	var r_type = document.getElementById("repository_type");
	var repository_type = r_type.options[r_type.selectedIndex].text;
	var p_file_path = document.getElementById("pipeline_file_path");
	var pipeline_file_path = p_file_path.options[p_file_path.selectedIndex].text;

	if(pipeline_file_path == 'DotNet'){
     pipeline_file_path = "dotnet_pipeline.yml"
	}
	else if(pipeline_file_path == 'Java'){
    pipeline_file_path = "java_pipeline.yml"

	}
	else if(pipeline_file_path == 'NodeJS'){
    pipeline_file_path = "nodejs_pipeline.yml"

	}
	else if(pipeline_file_path == 'Container'){
    pipeline_file_path = "container_pipeline.yml"

	}
    else if(pipeline_file_path == 'K8s'){
    pipeline_file_path = "k8s_pipeline.yml"

	}


var xhr = new XMLHttpRequest();
var url = "http://"+host_name+":5000/save";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    document.getElementById('loader').style.display = 'none';

    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        if(json.status == "success"){
   var x = document.getElementById("snackbar");
    x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        console.log(json.status);
        }
    }
};
var data = JSON.stringify({"project_name": project_name, "project_description": project_description,
"source_control": version_control, "visibility":visibility, "process_template":process_template, "organization":organization_name,
 "pipeline_name":pipeline_name, "pipeline_description":pipeline_description, "repo_name":repository_name, "branch_name":branch_name,
 "repo_type":repository_type, "pipeline_file_path":pipeline_file_path});
xhr.send(data);



	}


function sync()
{
  var project_name = document.getElementById("project_name");
  var repository_name = document.getElementById("repository_name");
  var repository_name = document.getElementById("repository_name");
  var repository_name_repo = document.getElementById("repository_name_repo");
  repository_name.value = project_name.value;
  repository_name_repo.value = project_name.value
}
<!--PROCESS TEMPLATE API CALL THROUGH PYTHON-->

function processTemplateAPI(event)
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
        	var json = JSON.parse(data);
//        	console.log(json)
        	json_process = json[0]['value']
        	json_project = json[1]['value']
        console.log(json_process)
        var select = document.getElementById("process_template");
        for (var key in json_process) {
    // check if the property/key is defined in the object itself, not in parent
    if (json_process.hasOwnProperty(key)) {
        select.options[select.options.length] = new Option(json_process[key]['name'], json_process[key]['typeId']);
//        console.log(key, json[key]);
        <!--window.alert(json_process[key]['name'])-->

    }
}
 var select = document.getElementById('project_name_repo');
   for (var key in json_project) {
   console.log(json_project[key]['name'])
//   window.alert(json_project[key])
    // check if the property/key is defined in the object itself, not in parent
    if (json_project.hasOwnProperty(key)) {
        select.options[select.options.length] = new Option(json_project[key]['name'], json_project[key]['id']);
//        console.log(key, json[key]);
        <!--window.alert(json[key]['name'])-->

    }
    }
// daySelect.appendChild("<option value=\"my value\">My Option</option>");

//var demo = document.getElementById("project_name_repo").children[0];
//optGroup.appendChild(new Option())

        <!--for (i=0; json.length; i++){-->
        <!--console.log(json[i]);-->

        <!--}-->

       <!--window.alert(json);-->
    }

};

xhr.send();

}


	function syncAction(event)
{
    action_type = this.options[this.selectedIndex].text;
    console.log(action_type)
      var branch_n_policy = document.getElementById("branch_n_policy");
      var minimum_approver_count_div = document.getElementById("minimum_approver_count_div");
      var policy_repository_id_div = document.getElementById("policy_repository_id_div");
        var id_policy = document.getElementById('id_policy');
    if(action_type == "Delete"){
    console.log(action_type)
      branch_n_policy.style.display = "none";
      minimum_approver_count_div.style.display = "none";
      policy_repository_id_div.style.display = "none";
      id_policy.style.display = "block";
    }

<!--UPDATE ACTION-->
    if(action_type == "Update"){
    console.log(action_type)
      branch_n_policy.style.display = "block";
      minimum_approver_count_div.style.display = "block";
      policy_repository_id_div.style.display = "none";
      id_policy.style.display = "block";
    }

<!--CREATE ACTION-->
    if(action_type == "Create"){
    console.log(action_type)
      branch_n_policy.style.display = "block";
      minimum_approver_count_div.style.display = "block";
      policy_repository_id_div.style.display = "block";
      id_policy.style.display = "none";
    }

  <!--var project_name = document.getElementById("project_name");-->
  <!--var repository_name = document.getElementById("repository_name");-->
  <!--repository_name.value = project_name.value;-->
}
