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
                func.startswith('interact')
        ): continue
        
        #print(f'function found: {func}')
        real_funcs.append(func)
        

    actions = []
    for func in real_funcs:
        action = dict()
        function = getattr(InstaPy, func)

        action['type'] = 'action'
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
            param['position'] = index - 1
            param['name'] = str(para)

            # TODO someone please fix this condition
            param['defaultValue'] = None if str(actual_param.default) == '<class \'inspect._empty\'>' else actual_param.default
            # save type of the annotation
            param['type'] = None if str(actual_param.annotation) == '<class \'inspect._empty\'>' else actual_param.annotation.__name__

            params.append(param)

        action['params'] = params

        actions.append(action)

    return actions
    

from config import db
from tinydb import where

if __name__ == '__main__':
    db.remove(where('type') == 'action')

    actions = get_actions()

    db.insert_multiple(actions)
    db.close()
