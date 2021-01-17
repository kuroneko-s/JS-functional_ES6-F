function _filter(obj, func){
    let new_arr = [];
    _each(obj, function(val){
        if(func(val)){
            new_arr.push(val)
        }
    })
    return new_arr;
}

function _map(obj, func){
    let new_arr = [];
    _each(obj, function(val, key){
        new_arr.push(func(val, key))
    })
    return new_arr;
}

function _nullCheck(obj){
    return typeof obj == 'object' && !!obj
}

function _keys(obj){
    return _nullCheck(obj) ? Object.keys(obj) : []
}

function _get(obj, key){
    return obj == null ? undefined : obj[key]
}

function _each(obj, func){
    let keys = _keys(obj)
    for (let i = 0; i < keys.length; i++){
        func(obj[keys[i]], keys[i])
    }

    return obj;
}

function _curryr(f){
    return function(a){
        if (arguments.length == 2){
            return f(arguments[0], arguments[1])
        }
        return function(b){
            return f(b, a)
        }
    }
};

function _curry(f){
    return function(a){
        if (arguments.length == 2){
            return f(arguments[0], arguments[1])
        }
        return function(b){
            return f(a, b)
        }
    }
};

let s = Array.prototype.slice
function _slice(obj, val){
    return s.call(obj, val || 1 )
}

function _reduce(list, iter, result){
    if(arguments.length == 2){
        result = list[0];
        list = _slice(list, 1);
    }

    _each(list, function(val){
        result = iter(result, val)
    })

    return result;
};

function _pipe(){
    let fns = arguments
    return function(args){
        return _reduce(fns, function(args, fn){
            return fn(args)
        }, args)
    }
}

function _go(args){
    let fns = _slice(arguments)
    return _pipe.apply(null, fns)(args);
}

//identity
function _identity(val){
    return val
}

// values
function _values(data){
    return _map(data, _identity);
}

function _pluck(data, key){
    return _map(data, function(val){
        return val[key];
    });
}

function _negate(func){
    return function(val){
        return !func(val)
    }
}

function _reject(data, fn){
    return _filter(data, _negate(fn));
}

//find
function _find(data, predi){
    let keys = _keys(data)
    for (var i = 0; i < keys.length; i++){
        let val = data[keys[i]];
        if(predi(val)) return val;
    }
    return -1;
}

//find_index
function _find_index(data, predi){
    let keys = _keys(data)
    for (var i = 0; i < keys.length; i++){
        if(predi(data[keys[i]])) return i;
    }

    return -1;
}

//some
function _some(data, predi){
    return _find_index(data, predi || _identity) != -1;
}

//every
function _every(data, predi){
    return _find_index(data, _negate(predi || _identity)) == -1;
}

//_min
function _min(data){
    return _reduce(data, function(a, b){
        return a < b ? a : b;
    });
}

//_max
function _max(data){
    return _reduce(data, function(a, b){
        return a > b ? a : b;
    });
}

function _push(obj, key, val){
    (obj[key] = obj[key] || []).push(val);
    return obj;
}

function _group_by(data, iter){
    return _reduce(data, function(grouped, val){
        return _push(grouped, iter(val), val);
    }, {})
}

function _count_by(data, iter){
    return _reduce(data, function(count, val){
        let key = iter(val);
        count[key] ? count[key]++ : count[key] = 1;
        return count;
    }, {})
}

// (조건 추가)
//_min_by 
function _min_by(data, iter){
    return _reduce(data, function(a, b){
        return iter(a) < iter(b) ? a : b;
    })
}

//_max_by
function _max_by(data, iter){
    return _reduce(data, function(a, b){
        return iter(a) > iter(b) ? a : b;
    })
}

let _mapCu = _curryr(_map),
        _filterCu = _curryr(_filter);
let _getCu = _curryr(_get)
let _length = _getCu('length')
let _pairs = _mapCu((val, key) => [key, val]);