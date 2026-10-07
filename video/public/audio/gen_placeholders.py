import numpy as np
from scipy.io import wavfile

SAMPLE_RATE = 44100
duration = 0.5 # 0.5s dummy length
t = np.linspace(0, duration, int(duration * SAMPLE_RATE))
# Soft generic sine blip for testing
dummy_audio = np.sin(2 * np.pi * 400 * t) * np.exp(-t * 10) * 0.1

cues = [
    'sfx-glitch.wav',
    'sfx-riser-short.wav',
    'sfx-glass-hit.wav',
    'sfx-swipe-click.wav',
    'sfx-glass-scan.wav',
    'sfx-bloom-pop.wav',
    'sfx-chat-typing.wav',
    'sfx-lock-snap.wav',
    'sfx-rapid-click.wav',
    'sfx-whoosh-pops.wav',
    'sfx-toggle.wav',
    'sfx-export-ding.wav',
    'sfx-sub-bass-hit.wav'
]

for filename in cues:
    wavfile.write(filename, SAMPLE_RATE, (dummy_audio * 32767).astype(np.int16))
    print(f"Created placeholder: {filename}")
