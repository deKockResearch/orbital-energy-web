"""
Decode Configuration of atom's electronic structure
Input: shell, string
Output: electronic structure, string
"""
def decodeConfig(shell):
    n=shell
    d='spdf'.find
    s='sspspdspdspfdspfdsp'
    i=0
    while n>0:
        c=s[i]
        print(c)
        t=d(c)*4+2
        print(t)
        print(repr(s[:i].count(c)-~d(c))+c,min(t,n))
        n-=t
        print(n)
        i+=1

if __name__ == "__main__":
    print(decodeConfig(4))