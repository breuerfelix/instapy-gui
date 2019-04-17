#!/usr/bin/env python

from instapy import InstaPy
from inspect import signature, getdoc, Parameter

def get_actions():
    real_funcs = []
    for func in dir(InstaPy):
        if func.startswith('__') and func.endswith('__'):
            # just a class function
            continue

        # only use following functions
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
            param['type'] = None if str(actual_param.annotation) == '<class \'inspect._empty\'>' else actual_param.annotation.__name__

            params.append(param)

        action['params'] = params

        actions.append(action)

    return actions


from database import client

if __name__ == '__main__':
    table = client.general.actions
    table.create_index('functionName', unique = True, background = True)

    for action in get_actions():
        table.replace_one({ 'functionName': action['functionName'] }, action, upsert = True)

    client.close()
    print('added actions to mongodb')
