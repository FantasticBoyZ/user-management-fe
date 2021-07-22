import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8082/api/section/'

class SectionService {
    getAllSection() {
        return axios.get(API_URL + 'all', { headers: authHeader() });
    }
    getUserBySection(params) {

        return axios.get(API_URL + 'user', { headers: authHeader(), params });
    }
    generateTree(list) {
        var map = {}, node, roots = [], i;

        for (i = 0; i < list.length; i += 1) {
            map[list[i].id] = i; // initialize the map
            list[i].children = []; // initialize the children
        }

        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            // console.log(node);
            if (node.parentId !== null) {
                // if you have dangling branches check that map[node.parentId] exists
                list[map[node.parentId]].children.push(node);
            } else {
                roots.push(node);
            }
        }
        console.log(roots)
        return roots
    }
    searchTree(root, keyword) {
        var stack = [], node, ii;
        stack.push(root);

        while (stack.length > 0) {
            node = stack.pop();
            if (node.name.includes(keyword)) {
                // Found it!
                return node;
            } else if (node.children && node.children.length) {
                for (ii = 0; ii < node.children.length; ii += 1) {
                    stack.push(node.children[ii]);
                }
            }
        }
        // Didn't find it. Return null.
        return null;
    }
}

export default new SectionService();