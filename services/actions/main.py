#!/usr/bin/env python
from dotenv import load_dotenv
load_dotenv()

from instapy import InstaPy
from inspect import signature, getdoc
import re

def get_actions():
    real_funcs = []
    for func in dir(InstaPy):
        if func.startswith('__') and func.endswith('__'):
            # just a class function
            continue

        # only use mentioned functions
        if not (
                func.startswith('set') or
                func.startswith('follow') or
                func.startswith('interact') or
                func.startswith('like') or
                func.startswith('unfollow')
        ): continue

        real_funcs.append(func)


    actions = []
    for func in real_funcs:
        action = dict()
        function = getattr(InstaPy, func)

        action['functionName'] = func
        action['description'] = getdoc(function)

        params = []
        sig = signature(function)

        for index, para in enumerate(sig.parameters):
            # ignore 'self'
            if index == 0: continue

            actual_param = sig.parameters[para]
            param = dict()

            # substract 1 since 0 is the self parameter
            param['name'] = str(para)

            # TODO someone please fix these condition
            if str(actual_param.default) == '<class \'inspect._empty\'>':
                param['defaultValue'] = None
                param['optional'] = False
            else:
                param['defaultValue'] = actual_param.default
                param['optional'] = True

            # save type of the annotation
            paramtype = None

            if 'inspect._empty' in str(actual_param.annotation):
                paramtype = None
            elif 'typing.Tuple' in str(actual_param.annotation):
                # converts 'typing.Tuple[int, str]' to 'tuple:int,str'
                tuple_types = re.search('(?<=\[).*?(?=\])', str(actual_param.annotation))
                tuple_types = tuple_types.group().split(',')
                tuple_types = ','.join(list(map(lambda x: x.strip(), tuple_types)))
                paramtype = f'tuple:{tuple_types}'
            else:
                paramtype = actual_param.annotation.__name__

            param['type'] = paramtype

            params.append(param)

        action['params'] = params

        actions.append(action)

    return actions


from database import client

if __name__ == '__main__':
    table = client.configuration.actions
    # table.create_index('functionName', unique = True, background = True)

    for action in get_actions():
        table.replace_one({ 'functionName': action['functionName'] }, action, upsert = True)

    client.close()
    print('added actions to mongodb')