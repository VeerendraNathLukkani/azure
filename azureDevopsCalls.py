import requests
from requests.auth import HTTPBasicAuth
import asyncio
import time
import aiohttp
from aiohttp import BasicAuth
from config import payload, PAT


async def fetch_get(session, url):
    async with session.get(url, auth=BasicAuth(PAT, PAT)) as resp:
        return await resp.json()
        # Catch HTTP errors/exceptions here


async def fetch_post(session, url, json):
    async with session.post(url, auth=BasicAuth(PAT, PAT), json=json) as resp:
        return await resp.json()
        # Catch HTTP errors/exceptions here


async def fetch_concurrent(urls_):
    _response = {}
    loop = asyncio.get_event_loop()
    async with aiohttp.ClientSession() as session:
        tasks = []
        for u in urls_:
            tasks.append(loop.create_task(fetch_get(session, u)))

        for result in asyncio.as_completed(tasks):
            page = await result
            print(page)
            if 'typeId' in page['value'][0]:
                _response[0] = page
            else:
                _response[1] = page
            # _response.append(page)

    return _response


async def fetch_concurrent_post(urls_, request_body):
    _response = []
    loop = asyncio.get_event_loop()
    async with aiohttp.ClientSession() as session:
        tasks = []
        index = 0
        for u in urls_:
            tasks.append(loop.create_task(fetch_post(session, u, json=request_body[index])))
            index += 1
        for result in asyncio.as_completed(tasks):
            page = await result
            print(page)
            _response.append(page)

    return _response

# urls = ['https://dev.azure.com/demoone007/_apis/projects?api-version=5.1',
#         'https://dev.azure.com/demoone007/_apis/projects?api-version=5.1',
#         'https://dev.azure.com/demoone007/_apis/projects?api-version=5.1']

# asyncio.run(fetch_concurrent(urls))


def get_request_with_basic_auth(url):
    return requests.get(url=url, auth=HTTPBasicAuth(PAT, PAT))


def post_request_with_auth(url, json):
    response = requests.post(url, auth=HTTPBasicAuth(PAT, PAT), json=json)
    print(response.json(), response.status_code)
    return response


def get_organizations():
    # Fill in with your personal access token and org URL
    organization_url = 'https://dev.azure.com/demoone007/_apis/Contribution/HierarchyQuery?api-version=5.0-preview.1'
    r = post_request_with_auth(organization_url, payload)
    # r.request.headers['Authorization']
    return r.json()


def get_process_template(organization):
    response = get_request_with_basic_auth(f'https://dev.azure.com/{organization}/'
                                           f'_apis/work/processes?api-version=5.1-preview')
    return response


def get_process_template_and_project(organization, project=None):
    response = asyncio.run(fetch_concurrent([f'https://dev.azure.com/{organization}'
                                             f'/_apis/work/processes?api-version=5.1-preview',
                                             f'https://dev.azure.com/{organization}/_apis/projects?api-version=5.1']))
    # response = get_request_with_basic_auth(f'https://dev.azure.com/{organization}/'
    #                                        f'_apis/work/processes?api-version=5.1-preview')
    return response


def get_projects(organization):
    response = get_request_with_basic_auth(f'https://dev.azure.com/{organization}/_apis/projects?api-version=5.1')
    return response.json()


def create_project(json_data, organization):
    response = post_request_with_auth(f'https://dev.azure.com/{organization}/_apis/projects?api-version=5.1', json_data)
    return response


def create_project_and_repo(json_data, urls):
    response = post_request_with_auth(urls, json_data)
    return response

# 842982


def create_project_and_repo_sequential(json_data, organization, repo_list):

    project_response = create_project(json_data, organization)
    urls = []
    id_project = None
    if 'id' in project_response.json():
        time.sleep(5)
        project_details = get_projects(organization)
        project_details = project_details['value']
        for _i in project_details:
            print(_i['name'], json_data['name'])
            if json_data['name'] == _i['name']:
                id_project = _i['id']

        if id_project is not None:
            request_data_list = []
            request_data = {"name": "", "project": {"id": ""}}
            for _name in repo_list:
                request_data['name'] = _name
                request_data['project']['id'] = id_project
                request_data_list.append(request_data)
                urls.append(f'https://dev.azure.com/{organization}/_apis/git/repositories?api-version=5.1')
            # final_response = post_request_with_auth(urls[1], request_data_list[1])
            final_response = asyncio.run(fetch_concurrent_post(urls, request_data_list))
            return final_response

    else:
        return project_response.json()


def create_team(organization, project_id, json_body):
    return post_request_with_auth(f'https://dev.azure.com/{organization}/_apis/projects'
                                  f'/{project_id}/teams?api-version=5.1', json_body).json()
