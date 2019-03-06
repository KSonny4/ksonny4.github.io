import subprocess

variants = [1,2,3]

with open('dat.out','a') as file:
    for v in variants:
        print(f'code={v}')
        file.write(f'code={v}\n')
        for i in range(10):
            print(f'iteration={i}')
            ret = subprocess.Popen(
                ['java','-jar','benchmarking/out/artifacts/benchmarking_jar/benchmarking.jar',f'{v}'],
                stdout=subprocess.PIPE)
            file.write(ret.stdout.read().decode()+'\n')
