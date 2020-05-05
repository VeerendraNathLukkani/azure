from flask import Flask, render_template, make_response, request
from flask_restful import Resource, Api
import subprocess
import azureDevopsCalls


app = Flask(__name__)
api = Api(app)


class Index(Resource):
    def get(self):
        headers = {'Content-Type': 'text/html'}
        response_data = azureDevopsCalls.get_organizations()
        print(response_data)
        response_data = response_data['dataProviders']['ms.vss-features.my-organizations-data-provider']['organizations']
        print(response_data)

        return make_response(render_template('home.html', data=response_data), 200, headers)


# API for Process template

class ProcessTemplate(Resource):
    def get(self):
        organization = request.args.get('organization')
        response = azureDevopsCalls.get_process_template_and_project(organization)
        # _result = {}
        # i = 0
        # for _i in response:
        #     _result[i] = _i
        #     i += 1
        # return _result
        return response

# CREATE PROJECT EXAMPLE
class Project(Resource):
    def post(self):
        json_data = request.get_json()
        print(json_data)
        response = azureDevopsCalls.create_project(json_data['project_data'], json_data['organization'])
        print(response.json())
        print(response.status_code)
        return response.json()


# CREATE PROJECT EXAMPLE
class ProjectAndRepo(Resource):
    def post(self):
        json_data = request.get_json()
        print(json_data)
        response = azureDevopsCalls.create_project_and_repo_sequential(json_data['project_data'],
                                                                       json_data['organization'],
                                                                       json_data['repo_list'])
        print(response)
        return response


def write_format(key, value):
    return f'{key}="{value}"\n'


class Save(Resource):
    def post(self):
        data = request.get_json()
        print(data)
        with open("variables", "w+") as f:
            for key, value in data.items():
                f.write(write_format(key, value))
            return {"status": "success"}


class PolicyOrCLIRun(Resource):
    def post(self):
        data = request.get_json()
        print(data)
        cmd = ''
        if data['action_type'] == "Create":
            branch_name = data['branch_name']
            minimum_approver_count = data['minimum_approver_count']
            policy_project_name = data['policy_project_name']
            policy_repository_id = data['policy_repository_id']
            cmd = f'az repos policy approver-count create --allow-downvotes true --blocking true --branch {branch_name}' \
                f' --creator-vote-counts true --enabled true --minimum-approver-count {minimum_approver_count}' \
                f' --reset-on-source-push true --branch-match-type exact --detect true --project {policy_project_name} ' \
                f'--repository-id  {policy_repository_id}'

        elif data['action_type'] == "Update":
            branch_name = data['branch_name']
            minimum_approver_count = data['minimum_approver_count']
            policy_project_name = data['policy_project_name']
            id_ = data['id']
            cmd = f'az repos policy approver-count update --id {id_} --allow-downvotes true --blocking true ' \
                f'--branch {branch_name} --creator-vote-counts true --enabled true --minimum-approver-count' \
                f' {minimum_approver_count} --reset-on-source-push true --branch-match-type exact' \
                f' --detect true --project {policy_project_name}'

        elif data['action_type'] == "Delete":
            id_ = data['id']
            policy_project_name = data['policy_project_name']
            cmd = f'az repos policy delete --id {id_} --detect true --project {policy_project_name} --yes'

            print(cmd)
        with open("output.log", "w+") as f:

            process = subprocess.Popen(cmd, stdout=f,
                                           stderr=f, shell=True)
            process.wait()
        return {'out_put': process.returncode}


class CLIRun(Resource):
    def post(self):
        data = request.get_json()
        print(data)
        team_name = data['team_name']
        team_description = data['team_description']
        cmd = f'az devops team create --name {team_name} --description {team_description}' \
              f' --detect true --project -project --verbose --output yaml'
        with open("output.log", "w+") as f:
            process = subprocess.Popen(cmd, stdout=f, stderr=f, shell=True)
            process.wait()
        return {'out_put': process.returncode}


class RunCMD(Resource):
    def get(self):
        with open("output.log", "a+") as f:
            process = subprocess.Popen(["./Create_Project_and_pipeline.sh"], stdout=f,
                                       stderr=f, shell=False)
            process.wait()
        return {'out_put': process.returncode}


@app.route('/log')
def content():
    text = open('output.log', 'r+')
    content = text.read()
    text.close()
    return render_template('log.html', text=content)


class Teams(Resource):

    def post(self):
        data = request.get_json()
        return azureDevopsCalls.create_team(data['organization'], data['project_id'], data['request_data'])


api.add_resource(Index, '/')
api.add_resource(Save, '/save')
api.add_resource(PolicyOrCLIRun, '/policyorclirun')
api.add_resource(CLIRun, '/clirun')
api.add_resource(RunCMD, '/cmd')
api.add_resource(ProcessTemplate, '/processtemplate')
api.add_resource(Project, '/project')
api.add_resource(ProjectAndRepo, '/projectandrepo')
api.add_resource(Teams, '/teams')


if __name__ == '__main__':
    app.run(debug=True)
