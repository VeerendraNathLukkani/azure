#!/bin/bash
#Adding PAT key for Azure DevOps operations
export AZURE_DEVOPS_EXT_PAT=$my_pat

#Declaring Variable file path to refer
. variables

#Create Project in Azure DevOps
az devops project create --name $project_name --description $project_description --org $organization --process "$process_template" --source-control $source_control --visibility $visibility --output yaml

#Clone framework project Repo
git clone https://nzefmyk562wsh2wiaphmh62eeu7723naiutz6bhzyx255hnybq6q@dev.azure.com/SX00562018/Digital_Program/_git/framework

#Clone new project repo
git clone https://nzefmyk562wsh2wiaphmh62eeu7723naiutz6bhzyx255hnybq6q@dev.azure.com/SX00562018/$project_name/_git/$repo_name

#Copy template file to new project
cp $framework_project/$pipeline_template $project_name/$pipeline_file_path

# Push the file to New project's Repo
cd $project_name
git add $pipeline_file_path
git config --global user.email "sx00562018@mpntechm.onmicrosoft.com"
git config --global user.name "Selva Ramasamy"
git commit -m "add template file"
git push

#Create an Empty pipeline in the New Project
az pipelines create --name $pipeline_name --description $pipeline_description --project $project_name --repository $repo_name --branch $branch_name --repository-type tfsgit --yaml-path $pipeline_file_path

#Create backup of variable for future reference
cp variables $project_name